"""
PlaceMentor AI Real Code Execution Judge Engine
Executes Python, JavaScript, Java, C, C++, and SQL solutions with full compiler/runtime error reporting.
"""

import ast
import io
import json
import os
import re
import shutil
import sqlite3
import subprocess
import sys
import tempfile
import time
import traceback
from typing import Any, Dict, List, Optional
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from app.middlewares.auth_middleware import get_optional_current_user

router = APIRouter(prefix="/execute", tags=["Execution"])

SQL_PROBLEMS = {
    "combine-two-tables",
    "second-highest-salary",
    "duplicate-emails",
    "customers-who-never-order",
    "department-highest-salary",
}


class TestCaseItem(BaseModel):
    input: str
    expectedOutput: str
    isHidden: Optional[bool] = False


class ExecutionRequest(BaseModel):
    code: str
    language: str
    problemId: str
    testCases: List[TestCaseItem] = []
    isSubmit: Optional[bool] = False
    mode: Optional[str] = None
    userId: Optional[str] = None


class TestCaseResult(BaseModel):
    input: str
    expected: str
    actual: str
    passed: bool = False
    reason: Optional[str] = None
    isHidden: Optional[bool] = False
    error: Optional[str] = None


class ExecutionResponse(BaseModel):
    status: str  # "Accepted" | "Wrong Answer" | "Runtime Error" | "Compilation Error" | "Time Limit Exceeded" | "Need Solution" | "Execution Error"
    isSubmit: bool
    message: Optional[str] = None
    runtime: int
    memory: float
    passedCount: int
    totalCount: int
    passed_count: Optional[int] = None
    total_count: Optional[int] = None
    visiblePassed: int
    visibleTotal: int
    hiddenPassed: int
    hiddenTotal: int
    testCaseResults: List[Dict[str, Any]]
    consoleOutput: Optional[str] = None


# Data structures for Linked List & Tree problems
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next


class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right


def list_to_linked_list(arr: list) -> Optional[ListNode]:
    if not arr:
        return None
    head = ListNode(arr[0])
    curr = head
    for v in arr[1:]:
        curr.next = ListNode(v)
        curr = curr.next
    return head


def linked_list_to_list(head: Optional[ListNode]) -> list:
    res = []
    curr = head
    visited = set()
    while curr:
        if id(curr) in visited:
            break
        visited.add(id(curr))
        res.append(curr.val)
        curr = curr.next
    return res


def list_to_tree(arr: list) -> Optional[TreeNode]:
    if not arr or arr[0] is None:
        return None
    root = TreeNode(arr[0])
    queue = [root]
    i = 1
    while queue and i < len(arr):
        node = queue.pop(0)
        if node is not None:
            if i < len(arr) and arr[i] is not None:
                node.left = TreeNode(arr[i])
                queue.append(node.left)
            else:
                node.left = None
            i += 1
            if i < len(arr) and arr[i] is not None:
                node.right = TreeNode(arr[i])
                queue.append(node.right)
            else:
                node.right = None
            i += 1
    return root


def tree_to_list(root: Optional[TreeNode]) -> list:
    if not root:
        return []
    res = []
    queue = [root]
    while queue:
        node = queue.pop(0)
        if node:
            res.append(node.val)
            queue.append(node.left)
            queue.append(node.right)
        else:
            res.append(None)
    while res and res[-1] is None:
        res.pop()
    return res


def normalize_value(val: Any) -> str:
    """Standardizes string/number/boolean/list representations for deterministic comparison."""
    if val is None:
        return "null"
    if isinstance(val, bool):
        return "true" if val else "false"
    if isinstance(val, (int, float)):
        return str(val)
    if isinstance(val, ListNode):
        return json.dumps(linked_list_to_list(val), separators=(",", ":"))
    if isinstance(val, TreeNode):
        return json.dumps(tree_to_list(val), separators=(",", ":"))
    if hasattr(val, "tolist"):  # NumPy ndarray or scalar
        return json.dumps(val.tolist(), separators=(",", ":"))
    if isinstance(val, (list, tuple)):
        cleaned = []
        for x in val:
            if isinstance(x, ListNode):
                cleaned.append(linked_list_to_list(x))
            elif isinstance(x, TreeNode):
                cleaned.append(tree_to_list(x))
            elif hasattr(x, "tolist"):
                cleaned.append(x.tolist())
            else:
                cleaned.append(x)
        return json.dumps(cleaned, separators=(",", ":"))
    if isinstance(val, dict):
        return json.dumps(val, sort_keys=True, separators=(",", ":"))
    if isinstance(val, str):
        val_str = val.strip()
        if val_str in ("true", "True"):
            return "true"
        if val_str in ("false", "False"):
            return "false"
        if val_str in ("null", "None"):
            return "null"
        try:
            json_safe = val_str.replace("'", '"')
            json_safe = re.sub(r"\bTrue\b", "true", json_safe)
            json_safe = re.sub(r"\bFalse\b", "false", json_safe)
            json_safe = re.sub(r"\bNone\b", "null", json_safe)
            parsed = json.loads(json_safe)
            return normalize_value(parsed)
        except Exception:
            return val_str
    return str(val)


def parse_test_input_values(input_str: str, problem_id: str = "") -> List[Any]:
    """Parses input string like 'nums = [2,7,11,15], target = 9' into argument values."""
    s = input_str.strip()
    if not s:
        return []

    parts = re.split(r",\s*(?=[a-zA-Z_][a-zA-Z0-9_]*\s*=)", s)
    if len(parts) > 1 or "=" in s:
        args = []
        for part in parts:
            if "=" in part:
                val_str = part.split("=", 1)[1].strip()
            else:
                val_str = part.strip()
            try:
                json_safe = re.sub(r"\bTrue\b", "true", val_str)
                json_safe = re.sub(r"\bFalse\b", "false", json_safe)
                json_safe = re.sub(r"\bNone\b", "null", json_safe)
                json_safe = json_safe.replace("'", '"')
                parsed_val = json.loads(json_safe)
                args.append(parsed_val)
            except Exception:
                args.append(val_str.strip("\"'"))
        if args:
            return args

    try:
        json_safe = re.sub(r"\bTrue\b", "true", s)
        json_safe = re.sub(r"\bFalse\b", "false", json_safe)
        json_safe = re.sub(r"\bNone\b", "null", json_safe)
        json_safe = json_safe.replace("'", '"')
        return [json.loads(json_safe)]
    except Exception:
        return [s]


def compare_actual_expected(actual: Any, expected_str: str, problem_id: str) -> tuple[bool, str]:
    """Compares actual return value against expected output with problem-specific semantics."""
    norm_act = normalize_value(actual)
    norm_exp = normalize_value(expected_str)

    if norm_act == norm_exp:
        return True, "Passed"

    # Empty list / null equivalence (e.g. empty linked list or empty tree)
    if norm_act in ("null", "None", "[]") and norm_exp in ("null", "None", "[]"):
        return True, "Passed"

    # Boolean equivalence
    if norm_act in ("true", "True") and norm_exp in ("true", "True"):
        return True, "Passed"
    if norm_act in ("false", "False") and norm_exp in ("false", "False"):
        return True, "Passed"

    # Float comparison with tolerance
    try:
        f_act = float(norm_act)
        f_exp = float(norm_exp)
        if abs(f_act - f_exp) < 1e-4:
            return True, "Passed"
    except (ValueError, TypeError):
        pass

    try:
        act_obj = json.loads(norm_act) if isinstance(norm_act, str) and norm_act.startswith(("[", "{", '"')) else actual
        exp_obj = json.loads(norm_exp) if isinstance(norm_exp, str) and norm_exp.startswith(("[", "{", '"')) else expected_str

        # If both are lists
        if isinstance(act_obj, list) and isinstance(exp_obj, list):
            # Two sum: indices order [0, 1] vs [1, 0]
            if problem_id == "two-sum" and len(act_obj) == 2 and len(exp_obj) == 2:
                if (act_obj[0] == exp_obj[0] and act_obj[1] == exp_obj[1]) or (
                    act_obj[0] == exp_obj[1] and act_obj[1] == exp_obj[0]
                ):
                    return True, "Passed"
                else:
                    return False, f"The returned indices {norm_act} do not equal expected {norm_exp}."

            # Top K / 3Sum / Unordered list problems
            if problem_id in ("top-k-frequent-elements", "3sum", "kth-largest-element-in-an-array", "find-all-anagrams-in-a-string"):
                def sort_recursive(item):
                    if isinstance(item, list):
                        return sorted([sort_recursive(x) for x in item], key=lambda k: str(k))
                    return item

                if sort_recursive(act_obj) == sort_recursive(exp_obj):
                    return True, "Passed"
                else:
                    return False, f"Expected {norm_exp} but received {norm_act}."

            # Group anagrams: compare canonical groups (each group sorted, list of groups sorted)
            if problem_id == "group-anagrams":
                def canon_groups(groups):
                    return sorted(["|".join(sorted(str(x) for x in g)) for g in groups])

                if canon_groups(act_obj) == canon_groups(exp_obj):
                    return True, "Passed"
                else:
                    return False, f"Expected grouped anagrams {norm_exp} but received {norm_act}."

            # General nested list comparison where outer order doesn't matter (e.g. intervals)
            if problem_id in ("merge-intervals",):
                if sorted(act_obj) == sorted(exp_obj):
                    return True, "Passed"

        # General boolean comparison
        if isinstance(act_obj, bool) and isinstance(exp_obj, bool):
            if act_obj == exp_obj:
                return True, "Passed"
    except Exception:
        pass

    return False, f"Expected {norm_exp} but received {norm_act}."


def execute_python_code(code: str, problem_id: str, test_cases: List[TestCaseItem]) -> Dict[str, Any]:
    """Executes Python code against test cases with real Python runtime."""
    # 1. Syntax / AST Compilation Check
    try:
        parsed_ast = ast.parse(code)
    except SyntaxError as syn_err:
        line_no = syn_err.lineno or 1
        text_line = (syn_err.text or "").strip()
        msg = f"SyntaxError at line {line_no}: {syn_err.msg}\n  {text_line}"
        return {
            "status": "Compilation Error",
            "message": msg,
            "runtime": 0,
            "testCaseResults": [
                {
                    "input": tc.input,
                    "expected": tc.expectedOutput,
                    "actual": msg,
                    "passed": False,
                    "reason": "Compilation / Syntax Error",
                    "isHidden": tc.isHidden,
                }
                for tc in test_cases
            ],
            "consoleOutput": msg,
        }
    except Exception as comp_err:
        msg = f"Compilation Error: {str(comp_err)}"
        return {
            "status": "Compilation Error",
            "message": msg,
            "runtime": 0,
            "testCaseResults": [
                {
                    "input": tc.input,
                    "expected": tc.expectedOutput,
                    "actual": msg,
                    "passed": False,
                    "reason": "Compilation / Syntax Error",
                    "isHidden": tc.isHidden,
                }
                for tc in test_cases
            ],
            "consoleOutput": msg,
        }

    # 2. Extract function name or Solution class
    func_name = None
    for node in getattr(parsed_ast, "body", []):
        if isinstance(node, ast.ClassDef) and node.name == "Solution":
            for item in node.body:
                if isinstance(item, ast.FunctionDef) and not item.name.startswith("_"):
                    func_name = item.name
                    break
        elif isinstance(node, ast.FunctionDef) and not node.name.startswith("_") and func_name is None:
            func_name = node.name

    if func_name is None:
        for node in ast.walk(parsed_ast):
            if isinstance(node, ast.FunctionDef) and not node.name.startswith("_"):
                func_name = node.name
                break

    # 3. Create execution scope
    from typing import (
        List as TList,
        Dict as TDict,
        Optional as TOptional,
        Tuple as TTuple,
        Set as TSet,
        Union as TUnion,
        Any as TAny,
    )
    stdout_capture = io.StringIO()
    exec_globals: Dict[str, Any] = {
        "__builtins__": __builtins__,
        "List": TList,
        "Dict": TDict,
        "Optional": TOptional,
        "Tuple": TTuple,
        "Set": TSet,
        "Union": TUnion,
        "Any": TAny,
        "ListNode": ListNode,
        "TreeNode": TreeNode,
    }

    for mod in ("math", "collections", "heapq", "bisect", "itertools", "functools", "re", "numpy"):
        try:
            exec_globals[mod] = __import__(mod)
            if mod == "numpy":
                exec_globals["np"] = exec_globals["numpy"]
        except Exception:
            pass

    try:
        old_stdout = sys.stdout
        sys.stdout = stdout_capture
        exec(code, exec_globals)
    except Exception as runtime_init_err:
        sys.stdout = old_stdout
        exc_type, exc_val, _ = sys.exc_info()
        err_msg = f"{exc_type.__name__ if exc_type else 'RuntimeError'}: {exc_val}"
        return {
            "status": "Runtime Error",
            "message": err_msg,
            "runtime": 0,
            "testCaseResults": [
                {
                    "input": tc.input,
                    "expected": tc.expectedOutput,
                    "actual": err_msg,
                    "passed": False,
                    "reason": err_msg,
                    "isHidden": tc.isHidden,
                }
                for tc in test_cases
            ],
            "consoleOutput": stdout_capture.getvalue() or err_msg,
        }
    finally:
        sys.stdout = old_stdout

    # Special handling for LRUCache OOP design
    if problem_id == "lru-cache-design" and "LRUCache" in exec_globals:
        lru_cls = exec_globals["LRUCache"]
        start_time = time.perf_counter()
        test_results = []
        for tc in test_cases:
            try:
                cache = lru_cls(2)
                cache.put(1, 1)
                cache.put(2, 2)
                act = cache.get(1)
                passed, reason = compare_actual_expected(act, tc.expectedOutput, problem_id)
                test_results.append({
                    "input": tc.input,
                    "expected": tc.expectedOutput,
                    "actual": normalize_value(act),
                    "passed": passed,
                    "reason": reason,
                    "isHidden": tc.isHidden,
                })
            except Exception as e:
                test_results.append({
                    "input": tc.input,
                    "expected": tc.expectedOutput,
                    "actual": f"RuntimeError: {type(e).__name__}: {e}",
                    "passed": False,
                    "reason": f"Runtime Error: {type(e).__name__}: {e}",
                    "isHidden": tc.isHidden,
                })
        duration_ms = max(10, int((time.perf_counter() - start_time) * 1000))
        passed_count = sum(1 for t in test_results if t["passed"])
        all_passed = passed_count == len(test_results)
        has_runtime = any("RuntimeError:" in str(t["actual"]) for t in test_results)
        return {
            "status": "Accepted" if all_passed else ("Runtime Error" if has_runtime else "Wrong Answer"),
            "runtime": duration_ms,
            "testCaseResults": test_results,
            "consoleOutput": stdout_capture.getvalue() or ("All test cases passed." if all_passed else "Test cases failed."),
        }

    # Resolve callable function
    target_fn = None
    if "Solution" in exec_globals and isinstance(exec_globals["Solution"], type):
        try:
            sol_instance = exec_globals["Solution"]()
            if func_name and hasattr(sol_instance, func_name) and callable(getattr(sol_instance, func_name)):
                target_fn = getattr(sol_instance, func_name)
            else:
                methods = [getattr(sol_instance, m) for m in dir(sol_instance) if not m.startswith("_") and callable(getattr(sol_instance, m))]
                if methods:
                    target_fn = methods[0]
        except Exception:
            pass
    elif func_name and func_name in exec_globals and callable(exec_globals[func_name]):
        target_fn = exec_globals[func_name]

    if not target_fn:
        for k, v in exec_globals.items():
            if not k.startswith("_") and k not in ("List", "Dict", "Optional", "Tuple", "Set", "Union", "Any", "ListNode", "TreeNode") and callable(v) and not isinstance(v, type):
                target_fn = v
                break

    if not target_fn:
        first_output = stdout_capture.getvalue().strip() or "No return value"
        return {
            "status": "Wrong Answer",
            "message": "No solution function found in submission.",
            "runtime": 5,
            "testCaseResults": [
                {
                    "input": tc.input,
                    "expected": tc.expectedOutput,
                    "actual": first_output,
                    "passed": False,
                    "reason": "No solution function found in submission.",
                    "isHidden": tc.isHidden,
                }
                for tc in test_cases
            ],
            "consoleOutput": stdout_capture.getvalue(),
        }

    # 4. Run each test case
    start_time = time.perf_counter()
    test_results = []
    has_runtime_error = False

    for tc in test_cases:
        args = parse_test_input_values(tc.input, problem_id)
        if problem_id == "reverse-linked-list" and args and isinstance(args[0], list):
            args = [list_to_linked_list(args[0])]
        elif problem_id in ("invert-binary-tree", "maximum-depth-of-binary-tree", "binary-tree-inorder-traversal") and args and isinstance(args[0], list):
            args = [list_to_tree(args[0])]
        elif problem_id == "lowest-common-ancestor-of-a-binary-search-tree" and len(args) >= 3 and isinstance(args[0], list):
            root_tree = list_to_tree(args[0])
            p_val = args[1]
            q_val = args[2]
            def find_tree_node(r, v):
                if not r: return None
                if r.val == v: return r
                return find_tree_node(r.left, v) or find_tree_node(r.right, v)
            p_node = find_tree_node(root_tree, p_val) or TreeNode(p_val)
            q_node = find_tree_node(root_tree, q_val) or TreeNode(q_val)
            args = [root_tree, p_node, q_node]

        try:
            old_stdout = sys.stdout
            sys.stdout = stdout_capture
            actual_val = target_fn(*args)
            sys.stdout = old_stdout

            if isinstance(actual_val, ListNode) or (actual_val is None and problem_id in ("reverse-linked-list", "merge-two-sorted-lists")):
                actual_val = linked_list_to_list(actual_val)
            elif isinstance(actual_val, TreeNode) or (actual_val is None and problem_id in ("invert-binary-tree", "maximum-depth-of-binary-tree", "binary-tree-inorder-traversal")):
                if problem_id == "lowest-common-ancestor-of-a-binary-search-tree":
                    actual_val = actual_val.val if actual_val else None
                else:
                    actual_val = tree_to_list(actual_val)

            passed, reason = compare_actual_expected(actual_val, tc.expectedOutput, problem_id)
            test_results.append(
                {
                    "input": tc.input,
                    "expected": tc.expectedOutput,
                    "actual": normalize_value(actual_val),
                    "passed": passed,
                    "reason": reason,
                    "isHidden": tc.isHidden,
                }
            )
        except Exception as tc_err:
            sys.stdout = old_stdout
            has_runtime_error = True
            err_line = f"{type(tc_err).__name__}: {str(tc_err)}"
            test_results.append(
                {
                    "input": tc.input,
                    "expected": tc.expectedOutput,
                    "actual": f"RuntimeError: {err_line}",
                    "passed": False,
                    "reason": f"Runtime Error: {err_line}",
                    "isHidden": tc.isHidden,
                }
            )

    duration_ms = max(15, int((time.perf_counter() - start_time) * 1000))
    passed_count = sum(1 for t in test_results if t["passed"])
    all_passed = passed_count == len(test_results)

    status = "Accepted" if all_passed else ("Runtime Error" if has_runtime_error else "Wrong Answer")

    return {
        "status": status,
        "runtime": duration_ms,
        "testCaseResults": test_results,
        "consoleOutput": stdout_capture.getvalue() or ("All test cases passed." if all_passed else f"{len(test_results) - passed_count} test case(s) failed."),
    }


def execute_javascript_code(code: str, problem_id: str, test_cases: List[TestCaseItem]) -> Dict[str, Any]:
    """Executes JavaScript and TypeScript using real Node.js subprocess."""
    if not shutil.which("node"):
        msg = "Node.js runtime is not available on this system."
        return {
            "status": "Compilation Error",
            "message": msg,
            "runtime": 0,
            "testCaseResults": [
                {
                    "input": tc.input,
                    "expected": tc.expectedOutput,
                    "actual": "Node.js runtime not found",
                    "passed": False,
                    "reason": "Runtime Unavailable",
                    "isHidden": tc.isHidden,
                }
                for tc in test_cases
            ],
            "consoleOutput": msg,
        }

    clean_code = code
    # Clean TypeScript type annotations if TypeScript solution provided
    clean_code = re.sub(r':\s*[a-zA-Z0-9_<>[\]|,\s]+(?=[,)])', '', clean_code)
    clean_code = re.sub(r'\)\s*:\s*[a-zA-Z0-9_<>[\]|\s]+\s*\{', ') {', clean_code)

    js_runner = f"""
    function ListNode(val, next) {{
        this.val = (val === undefined ? 0 : val);
        this.next = (next === undefined ? null : next);
    }}
    function TreeNode(val, left, right) {{
        this.val = (val === undefined ? 0 : val);
        this.left = (left === undefined ? null : left);
        this.right = (right === undefined ? null : right);
    }}
    function arrayToList(arr) {{
        if (!arr || arr.length === 0) return null;
        const head = new ListNode(arr[0]);
        let curr = head;
        for (let i = 1; i < arr.length; i++) {{
            curr.next = new ListNode(arr[i]);
            curr = curr.next;
        }}
        return head;
    }}
    function listToArray(head) {{
        const res = [];
        let curr = head;
        while (curr) {{
            res.push(curr.val);
            curr = curr.next;
        }}
        return res;
    }}
    function arrayToTree(arr) {{
        if (!arr || arr.length === 0 || arr[0] === null) return null;
        const root = new TreeNode(arr[0]);
        const queue = [root];
        let i = 1;
        while (queue.length > 0 && i < arr.length) {{
            const node = queue.shift();
            if (node) {{
                if (i < arr.length && arr[i] !== null && arr[i] !== undefined) {{
                    node.left = new TreeNode(arr[i]);
                    queue.push(node.left);
                }} else {{
                    node.left = null;
                }}
                i++;
                if (i < arr.length && arr[i] !== null && arr[i] !== undefined) {{
                    node.right = new TreeNode(arr[i]);
                    queue.push(node.right);
                }} else {{
                    node.right = null;
                }}
                i++;
            }}
        }}
        return root;
    }}
    function treeToArray(root) {{
        if (!root) return [];
        const res = [];
        const queue = [root];
        while (queue.length > 0) {{
            const node = queue.shift();
            if (node) {{
                res.push(node.val);
                queue.push(node.left);
                queue.push(node.right);
            }} else {{
                res.push(null);
            }}
        }}
        while (res.length > 0 && res[res.length - 1] === null) {{
            res.pop();
        }}
        return res;
    }}

    function serializeVal(v) {{
        if (v === undefined || v === null) return "null";
        if (typeof v === "boolean") return v ? "true" : "false";
        if (typeof v === "number") return String(v);
        if (v instanceof ListNode) return JSON.stringify(listToArray(v));
        if (v instanceof TreeNode) return JSON.stringify(treeToArray(v));
        if (Array.isArray(v)) return JSON.stringify(v);
        if (typeof v === "object") return JSON.stringify(v);
        return String(v);
    }}

    // User Code
    {clean_code}

    const testInputs = {json.dumps([tc.input for tc in test_cases])};
    const problemId = {json.dumps(problem_id)};

    let targetFn = null;
    try {{
        if (typeof Solution === "function") {{
            const s = new Solution();
            const methods = Object.getOwnPropertyNames(Object.getPrototypeOf(s)).filter(m => m !== "constructor");
            if (methods.length > 0 && typeof s[methods[0]] === "function") {{
                targetFn = s[methods[0]].bind(s);
            }}
        }}
    }} catch(e) {{}}

    if (!targetFn) {{
        const fnMatches = [...{json.dumps(code)}.matchAll(/(?:function|const|let|var|def)\\s+([a-zA-Z0-9_]+)/g)];
        for (const m of fnMatches) {{
            try {{
                const fn = eval(m[1]);
                if (typeof fn === "function" && !["ListNode", "TreeNode", "arrayToList", "listToArray", "arrayToTree", "treeToArray", "serializeVal"].includes(m[1])) {{
                    targetFn = fn;
                    break;
                }}
            }} catch(e) {{}}
        }}
    }}

    for (let t = 0; t < testInputs.length; t++) {{
        const inputStr = testInputs[t].trim();
        try {{
            let args = [];
            const parts = inputStr.split(/,\\s*(?=[a-zA-Z_][a-zA-Z0-9_]*\\s*=)/);
            for (const p of parts) {{
                const eq = p.indexOf("=");
                const valStr = eq >= 0 ? p.substring(eq + 1).trim() : p.trim();
                try {{
                    let safeJson = valStr.replace(/'/g, '"').replace(/\\bTrue\\b/g, 'true').replace(/\\bFalse\\b/g, 'false').replace(/\\bNone\\b/g, 'null');
                    args.push(JSON.parse(safeJson));
                }} catch(e) {{
                    args.push(valStr.replace(/^["']|["']$/g, ''));
                }}
            }}

            if (problemId === "reverse-linked-list" && args.length > 0 && Array.isArray(args[0])) {{
                args[0] = arrayToList(args[0]);
            }} else if (["invert-binary-tree", "maximum-depth-of-binary-tree", "binary-tree-inorder-traversal"].includes(problemId) && args.length > 0 && Array.isArray(args[0])) {{
                args[0] = arrayToTree(args[0]);
            }}

            if (!targetFn) {{
                console.log("RUNTIME_ERR::No solution function found");
                continue;
            }}

            const res = targetFn(...args);
            console.log("RESULT::" + serializeVal(res));
        }} catch(err) {{
            console.log("RUNTIME_ERR::" + (err.message || String(err)));
        }}
    }}
    """

    with tempfile.NamedTemporaryFile("w", suffix=".js", delete=False, encoding="utf-8") as f:
        f.write(js_runner)
        temp_path = f.name

    try:
        proc = subprocess.run(
            ["node", temp_path],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            timeout=5,
        )

        if proc.returncode != 0:
            err = proc.stderr.strip() or "JavaScript execution failed"
            is_syntax = "SyntaxError" in err
            return {
                "status": "Compilation Error" if is_syntax else "Runtime Error",
                "message": err,
                "runtime": 0,
                "testCaseResults": [
                    {
                        "input": tc.input,
                        "expected": tc.expectedOutput,
                        "actual": err,
                        "passed": False,
                        "reason": err,
                        "isHidden": tc.isHidden,
                    }
                    for tc in test_cases
                ],
                "consoleOutput": err,
            }

        lines = proc.stdout.strip().split("\n")
        test_results = []
        has_runtime = False

        for idx, tc in enumerate(test_cases):
            line = lines[idx] if idx < len(lines) else "RUNTIME_ERR::No output produced"
            if line.startswith("RESULT::"):
                act_str = line.replace("RESULT::", "").strip()
                passed, reason = compare_actual_expected(act_str, tc.expectedOutput, problem_id)
                test_results.append({
                    "input": tc.input,
                    "expected": tc.expectedOutput,
                    "actual": act_str,
                    "passed": passed,
                    "reason": reason,
                    "isHidden": tc.isHidden,
                })
            elif line.startswith("RUNTIME_ERR::"):
                has_runtime = True
                err_msg = line.replace("RUNTIME_ERR::", "").strip()
                test_results.append({
                    "input": tc.input,
                    "expected": tc.expectedOutput,
                    "actual": f"RuntimeError: {err_msg}",
                    "passed": False,
                    "reason": f"Runtime Error: {err_msg}",
                    "isHidden": tc.isHidden,
                })
            else:
                test_results.append({
                    "input": tc.input,
                    "expected": tc.expectedOutput,
                    "actual": line,
                    "passed": False,
                    "reason": "Execution failure",
                    "isHidden": tc.isHidden,
                })

        passed_count = sum(1 for t in test_results if t["passed"])
        all_passed = passed_count == len(test_results)

        return {
            "status": "Accepted" if all_passed else ("Runtime Error" if has_runtime else "Wrong Answer"),
            "runtime": 25,
            "testCaseResults": test_results,
            "consoleOutput": "All test cases passed." if all_passed else "Test cases failed.",
        }
    except subprocess.TimeoutExpired:
        return {
            "status": "Time Limit Exceeded",
            "message": "Time Limit Exceeded: Execution took longer than 5 seconds.",
            "runtime": 5000,
            "testCaseResults": [],
            "consoleOutput": "Time Limit Exceeded",
        }
    except Exception as js_err:
        return {
            "status": "Runtime Error",
            "message": str(js_err),
            "runtime": 0,
            "testCaseResults": [],
            "consoleOutput": str(js_err),
        }
    finally:
        if os.path.exists(temp_path):
            try:
                os.remove(temp_path)
            except Exception:
                pass


def execute_java_code(code: str, problem_id: str, test_cases: List[TestCaseItem]) -> Dict[str, Any]:
    """Compiles and executes Java code using javac and java with dynamic test execution."""
    if not shutil.which("javac") or not shutil.which("java"):
        msg = "Java runtime (javac/java) is not available on this system."
        return {
            "status": "Compilation Error",
            "message": msg,
            "runtime": 0,
            "testCaseResults": [
                {
                    "input": tc.input,
                    "expected": tc.expectedOutput,
                    "actual": "Java runtime not found",
                    "passed": False,
                    "reason": "Runtime Unavailable",
                    "isHidden": tc.isHidden,
                }
                for tc in test_cases
            ],
            "consoleOutput": msg,
        }

    temp_dir = tempfile.mkdtemp()
    try:
        test_inputs_java = ", ".join(json.dumps(tc.input) for tc in test_cases)
        # Generate Main.java harness with reflection
        java_harness = f"""
import java.util.*;
import java.io.*;
import java.lang.reflect.*;

class ListNode {{
    public int val;
    public ListNode next;
    public ListNode() {{}}
    public ListNode(int val) {{ this.val = val; }}
    public ListNode(int val, ListNode next) {{ this.val = val; this.next = next; }}
}}

class TreeNode {{
    public int val;
    public TreeNode left;
    public TreeNode right;
    public TreeNode() {{}}
    public TreeNode(int val) {{ this.val = val; }}
    public TreeNode(int val, TreeNode left, TreeNode right) {{
        this.val = val;
        this.left = left;
        this.right = right;
    }}
}}

{code}

public class Main {{
    public static String serialize(Object obj) {{
        if (obj == null) return "null";
        if (obj instanceof boolean[]) return Arrays.toString((boolean[]) obj);
        if (obj instanceof int[]) {{
            int[] arr = (int[]) obj;
            StringBuilder sb = new StringBuilder("[");
            for (int i = 0; i < arr.length; i++) {{
                sb.append(arr[i]);
                if (i < arr.length - 1) sb.append(",");
            }}
            sb.append("]");
            return sb.toString();
        }}
        if (obj instanceof int[][]) {{
            int[][] mat = (int[][]) obj;
            StringBuilder sb = new StringBuilder("[");
            for (int i = 0; i < mat.length; i++) {{
                sb.append(serialize(mat[i]));
                if (i < mat.length - 1) sb.append(",");
            }}
            sb.append("]");
            return sb.toString();
        }}
        if (obj instanceof ListNode) {{
            ListNode curr = (ListNode) obj;
            StringBuilder sb = new StringBuilder("[");
            while (curr != null) {{
                sb.append(curr.val);
                if (curr.next != null) sb.append(",");
                curr = curr.next;
            }}
            sb.append("]");
            return sb.toString();
        }}
        if (obj instanceof TreeNode) {{
            TreeNode root = (TreeNode) obj;
            List<String> items = new ArrayList<>();
            Queue<TreeNode> q = new LinkedList<>();
            q.add(root);
            while (!q.isEmpty()) {{
                TreeNode n = q.poll();
                if (n != null) {{
                    items.add(String.valueOf(n.val));
                    q.add(n.left);
                    q.add(n.right);
                }} else {{
                    items.add("null");
                }}
            }}
            while (!items.isEmpty() && items.get(items.size() - 1).equals("null")) {{
                items.remove(items.size() - 1);
            }}
            StringBuilder sb = new StringBuilder("[");
            for (int i = 0; i < items.size(); i++) {{
                sb.append(items.get(i));
                if (i < items.size() - 1) sb.append(",");
            }}
            sb.append("]");
            return sb.toString();
        }}
        if (obj instanceof String) return "\\"" + obj + "\\"";
        if (obj instanceof Collection) {{
            Collection<?> col = (Collection<?>) obj;
            StringBuilder sb = new StringBuilder("[");
            int i = 0;
            for (Object item : col) {{
                sb.append(serialize(item));
                if (i < col.size() - 1) sb.append(",");
                i++;
            }}
            sb.append("]");
            return sb.toString();
        }}
        return String.valueOf(obj);
    }}

    public static Object parseArg(String str, Class<?> targetType) {{
        str = str.trim();
        if (targetType == int.class || targetType == Integer.class) return Integer.parseInt(str);
        if (targetType == long.class || targetType == Long.class) return Long.parseLong(str);
        if (targetType == double.class || targetType == Double.class) return Double.parseDouble(str);
        if (targetType == boolean.class || targetType == Boolean.class) return Boolean.parseBoolean(str);
        if (targetType == String.class) {{
            if (str.startsWith("\\"") && str.endsWith("\\"") && str.length() >= 2) return str.substring(1, str.length() - 1);
            return str;
        }}
        if (targetType == int[].class) {{
            String s = str.replaceAll("[\\\\[\\\\]\\\\s]", "");
            if (s.isEmpty()) return new int[0];
            String[] parts = s.split(",");
            int[] arr = new int[parts.length];
            for (int i = 0; i < parts.length; i++) arr[i] = Integer.parseInt(parts[i]);
            return arr;
        }}
        if (targetType == int[][].class) {{
            if (str.startsWith("[") && str.endsWith("]")) str = str.substring(1, str.length() - 1).trim();
            if (str.isEmpty()) return new int[0][0];
            String[] rows = str.split("\\\\],\\\\s*\\\\[");
            int[][] mat = new int[rows.length][];
            for (int i = 0; i < rows.length; i++) {{
                String rowClean = rows[i].replaceAll("[\\\\[\\\\]\\\\s]", "");
                if (rowClean.isEmpty()) {{ mat[i] = new int[0]; continue; }}
                String[] p = rowClean.split(",");
                mat[i] = new int[p.length];
                for (int j = 0; j < p.length; j++) mat[i][j] = Integer.parseInt(p[j]);
            }}
            return mat;
        }}
        if (targetType == char[][].class) {{
            if (str.startsWith("[") && str.endsWith("]")) str = str.substring(1, str.length() - 1).trim();
            if (str.isEmpty()) return new char[0][0];
            String[] rows = str.split("\\\\],\\\\s*\\\\[");
            char[][] mat = new char[rows.length][];
            for (int i = 0; i < rows.length; i++) {{
                String rowClean = rows[i].replaceAll("[\\\\[\\\\]\\\\s\\"']", "");
                String[] p = rowClean.split(",");
                mat[i] = new char[p.length];
                for (int j = 0; j < p.length; j++) mat[i][j] = p[j].charAt(0);
            }}
            return mat;
        }}
        if (targetType == String[].class) {{
            String s = str.replaceAll("[\\\\[\\\\]]", "").trim();
            if (s.isEmpty()) return new String[0];
            String[] parts = s.split(",\\\\s*");
            String[] arr = new String[parts.length];
            for (int i = 0; i < parts.length; i++) arr[i] = parts[i].replaceAll("^[\\"']|[\\"']$", "");
            return arr;
        }}
        if (targetType == ListNode.class) {{
            int[] arr = (int[]) parseArg(str, int[].class);
            if (arr.length == 0) return null;
            ListNode head = new ListNode(arr[0]);
            ListNode curr = head;
            for (int i = 1; i < arr.length; i++) {{
                curr.next = new ListNode(arr[i]);
                curr = curr.next;
            }}
            return head;
        }}
        if (targetType == TreeNode.class) {{
            String s = str.replaceAll("[\\\\[\\\\]\\\\s]", "");
            if (s.isEmpty()) return null;
            String[] parts = s.split(",");
            if (parts.length == 0 || parts[0].equals("null")) return null;
            TreeNode root = new TreeNode(Integer.parseInt(parts[0]));
            Queue<TreeNode> q = new LinkedList<>();
            q.add(root);
            int idx = 1;
            while (!q.isEmpty() && idx < parts.length) {{
                TreeNode curr = q.poll();
                if (curr != null) {{
                    if (idx < parts.length && !parts[idx].equals("null")) {{
                        curr.left = new TreeNode(Integer.parseInt(parts[idx]));
                        q.add(curr.left);
                    }}
                    idx++;
                    if (idx < parts.length && !parts[idx].equals("null")) {{
                        curr.right = new TreeNode(Integer.parseInt(parts[idx]));
                        q.add(curr.right);
                    }}
                    idx++;
                }}
            }}
            return root;
        }}
        return str;
    }}

    public static void main(String[] args) {{
        String[] testInputs = new String[] {{ {test_inputs_java} }};
        String problemId = {json.dumps(problem_id)};
        
        try {{
            Solution sol = new Solution();
            Method targetMethod = null;
            for (Method m : Solution.class.getDeclaredMethods()) {{
                if (!Modifier.isStatic(m.getModifiers()) && !m.getName().equals("main")) {{
                    targetMethod = m;
                    break;
                }}
            }}
            
            if (targetMethod == null) {{
                System.out.println("FATAL_ERR::No solution method found in Solution class");
                return;
            }}
            
            Class<?>[] paramTypes = targetMethod.getParameterTypes();
            
            for (int t = 0; t < testInputs.length; t++) {{
                String inputStr = testInputs[t].trim();
                String[] parts = inputStr.split(",\\\\s*(?=[a-zA-Z_][a-zA-Z0-9_]*\\\\s*=)");
                Object[] invokeArgs = new Object[paramTypes.length];
                
                for (int i = 0; i < paramTypes.length && i < parts.length; i++) {{
                    String part = parts[i];
                    int eqIdx = part.indexOf("=");
                    String valStr = eqIdx >= 0 ? part.substring(eqIdx + 1).trim() : part.trim();
                    invokeArgs[i] = parseArg(valStr, paramTypes[i]);
                }}
                
                try {{
                    Object actual = targetMethod.invoke(sol, invokeArgs);
                    System.out.println("RESULT::" + serialize(actual));
                }} catch (InvocationTargetException ite) {{
                    Throwable cause = ite.getCause() != null ? ite.getCause() : ite;
                    System.out.println("RUNTIME_ERR::" + cause.getClass().getSimpleName() + ": " + cause.getMessage());
                }} catch (Exception ie) {{
                    System.out.println("RUNTIME_ERR::" + ie.getClass().getSimpleName() + ": " + ie.getMessage());
                }}
            }}
        }} catch (Exception e) {{
            System.out.println("FATAL_ERR::" + e.getMessage());
        }}
    }}
}}
"""
        with open(os.path.join(temp_dir, "Main.java"), "w", encoding="utf-8") as f:
            f.write(java_harness)

        comp_proc = subprocess.run(
            ["javac", "Main.java"],
            cwd=temp_dir,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            timeout=8,
        )

        if comp_proc.returncode != 0:
            err = comp_proc.stderr.replace(temp_dir, "").strip()
            return {
                "status": "Compilation Error",
                "message": err,
                "runtime": 0,
                "testCaseResults": [
                    {
                        "input": tc.input,
                        "expected": tc.expectedOutput,
                        "actual": err,
                        "passed": False,
                        "reason": "Compilation Error",
                        "isHidden": tc.isHidden,
                    }
                    for tc in test_cases
                ],
                "consoleOutput": err,
            }

        start_time = time.perf_counter()
        run_proc = subprocess.run(
            ["java", "Main"],
            cwd=temp_dir,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            timeout=5,
        )
        duration_ms = max(20, int((time.perf_counter() - start_time) * 1000))

        lines = run_proc.stdout.strip().split("\n")
        test_results = []
        has_runtime = False

        for idx, tc in enumerate(test_cases):
            line = lines[idx] if idx < len(lines) else "RUNTIME_ERR::No output produced"
            if line.startswith("RESULT::"):
                act_str = line.replace("RESULT::", "").strip()
                passed, reason = compare_actual_expected(act_str, tc.expectedOutput, problem_id)
                test_results.append({
                    "input": tc.input,
                    "expected": tc.expectedOutput,
                    "actual": act_str,
                    "passed": passed,
                    "reason": reason,
                    "isHidden": tc.isHidden,
                })
            elif line.startswith("RUNTIME_ERR::"):
                has_runtime = True
                err_msg = line.replace("RUNTIME_ERR::", "").strip()
                test_results.append({
                    "input": tc.input,
                    "expected": tc.expectedOutput,
                    "actual": f"RuntimeError: {err_msg}",
                    "passed": False,
                    "reason": f"Runtime Error: {err_msg}",
                    "isHidden": tc.isHidden,
                })
            else:
                test_results.append({
                    "input": tc.input,
                    "expected": tc.expectedOutput,
                    "actual": line,
                    "passed": False,
                    "reason": "Execution failure",
                    "isHidden": tc.isHidden,
                })

        passed_count = sum(1 for t in test_results if t["passed"])
        all_passed = passed_count == len(test_results)

        return {
            "status": "Accepted" if all_passed else ("Runtime Error" if has_runtime else "Wrong Answer"),
            "runtime": duration_ms,
            "testCaseResults": test_results,
            "consoleOutput": "All Java test cases compiled and verified." if all_passed else "Test verification failed.",
        }
    except subprocess.TimeoutExpired:
        return {
            "status": "Time Limit Exceeded",
            "message": "Time Limit Exceeded during Java execution.",
            "runtime": 8000,
            "testCaseResults": [],
            "consoleOutput": "Time Limit Exceeded",
        }
    except Exception as e:
        return {
            "status": "Compilation Error",
            "message": str(e),
            "runtime": 0,
            "testCaseResults": [],
            "consoleOutput": str(e),
        }
    finally:
        shutil.rmtree(temp_dir, ignore_errors=True)


def execute_cpp_code(code: str, problem_id: str, test_cases: List[TestCaseItem], is_c: bool = False) -> Dict[str, Any]:
    """Compiles and executes C/C++ code using gcc/g++ with dynamic universal harness."""
    compiler = "gcc" if is_c else "g++"
    if not shutil.which(compiler):
        msg = f"{compiler.upper()} compiler is not available on this system."
        return {
            "status": "Compilation Error",
            "message": msg,
            "runtime": 0,
            "testCaseResults": [
                {
                    "input": tc.input,
                    "expected": tc.expectedOutput,
                    "actual": f"{compiler} not found",
                    "passed": False,
                    "reason": "Compiler Unavailable",
                    "isHidden": tc.isHidden,
                }
                for tc in test_cases
            ],
            "consoleOutput": msg,
        }

    temp_dir = tempfile.mkdtemp()
    ext = ".c" if is_c else ".cpp"
    flags = ["-std=c11"] if is_c else ["-std=c++17"]

    src_file = os.path.join(temp_dir, f"solution{ext}")
    exe_file = os.path.join(temp_dir, "solution.exe")

    try:
        with open(src_file, "w", encoding="utf-8") as f:
            if not is_c:
                f.write("""
#include <iostream>
#include <vector>
#include <string>
#include <sstream>
#include <algorithm>
#include <unordered_map>
#include <unordered_set>
#include <queue>
#include <stack>
#include <cmath>

using namespace std;

struct ListNode {
    int val;
    ListNode *next;
    ListNode() : val(0), next(nullptr) {}
    ListNode(int x) : val(x), next(nullptr) {}
    ListNode(int x, ListNode *next) : val(x), next(next) {}
};

struct TreeNode {
    int val;
    TreeNode *left;
    TreeNode *right;
    TreeNode() : val(0), left(nullptr), right(nullptr) {}
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
    TreeNode(int x, TreeNode *left, TreeNode *right) : val(x), left(left), right(right) {}
};

inline string serialize(bool b) { return b ? "true" : "false"; }
inline string serialize(int x) { return to_string(x); }
inline string serialize(long long x) { return to_string(x); }
inline string serialize(double x) { return to_string(x); }
inline string serialize(const string& s) { return "\\"" + s + "\\""; }

template<typename T>
string serialize(const vector<T>& vec) {
    string res = "[";
    for (size_t i = 0; i < vec.size(); i++) {
        res += serialize(vec[i]);
        if (i + 1 < vec.size()) res += ",";
    }
    res += "]";
    return res;
}

inline string serialize(ListNode* head) {
    string res = "[";
    ListNode* curr = head;
    while (curr) {
        res += to_string(curr->val);
        if (curr->next) res += ",";
        curr = curr->next;
    }
    res += "]";
    return res;
}

inline string serialize(TreeNode* root) {
    if (!root) return "[]";
    string res = "[";
    queue<TreeNode*> q;
    q.push(root);
    vector<string> items;
    while (!q.empty()) {
        TreeNode* n = q.front();
        q.pop();
        if (n) {
            items.push_back(to_string(n->val));
            q.push(n->left);
            q.push(n->right);
        } else {
            items.push_back("null");
        }
    }
    while (!items.empty() && items.back() == "null") items.pop_back();
    for (size_t i = 0; i < items.size(); i++) {
        res += items[i];
        if (i + 1 < items.size()) res += ",";
    }
    res += "]";
    return res;
}

ListNode* buildList(const vector<int>& arr) {
    if (arr.empty()) return nullptr;
    ListNode* head = new ListNode(arr[0]);
    ListNode* curr = head;
    for (size_t i = 1; i < arr.size(); i++) {
        curr->next = new ListNode(arr[i]);
        curr = curr->next;
    }
    return head;
}

TreeNode* buildTree(const vector<string>& arr) {
    if (arr.empty() || arr[0] == "null") return nullptr;
    TreeNode* root = new TreeNode(stoi(arr[0]));
    queue<TreeNode*> q;
    q.push(root);
    size_t idx = 1;
    while (!q.empty() && idx < arr.size()) {
        TreeNode* curr = q.front();
        q.pop();
        if (curr) {
            if (idx < arr.size() && arr[idx] != "null") {
                curr->left = new TreeNode(stoi(arr[idx]));
                q.push(curr->left);
            }
            idx++;
            if (idx < arr.size() && arr[idx] != "null") {
                curr->right = new TreeNode(stoi(arr[idx]));
                q.push(curr->right);
            }
            idx++;
        }
    }
    return root;
}
""")
            else:
                f.write("""
#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>

struct ListNode {
    int val;
    struct ListNode *next;
};
""")

            f.write("\n" + code + "\n")

            # Generate Universal C++ Harness
            if not is_c and "int main(" not in code:
                f.write("\nint main() {\n    Solution sol;\n")
                for i, tc in enumerate(test_cases):
                    args = parse_test_input_values(tc.input, problem_id)
                    f.write(f"    // Test Case {i+1}\n    {{\n")
                    if problem_id == "two-sum":
                        nums = args[0] if len(args) > 0 and isinstance(args[0], list) else []
                        target = args[1] if len(args) > 1 else 0
                        f.write(f"        vector<int> nums = {{{','.join(map(str, nums))}}};\n")
                        f.write(f"        int target = {target};\n")
                        f.write('        auto res = sol.twoSum(nums, target);\n')
                        f.write('        cout << "RESULT::" << serialize(res) << endl;\n')
                    elif problem_id == "contains-duplicate":
                        nums = args[0] if len(args) > 0 and isinstance(args[0], list) else []
                        f.write(f"        vector<int> nums = {{{','.join(map(str, nums))}}};\n")
                        f.write('        auto res = sol.containsDuplicate(nums);\n')
                        f.write('        cout << "RESULT::" << serialize(res) << endl;\n')
                    elif problem_id == "valid-anagram":
                        s_str = args[0] if len(args) > 0 else ""
                        t_str = args[1] if len(args) > 1 else ""
                        f.write(f'        string s = "{s_str}";\n')
                        f.write(f'        string t = "{t_str}";\n')
                        f.write('        auto res = sol.isAnagram(s, t);\n')
                        f.write('        cout << "RESULT::" << serialize(res) << endl;\n')
                    elif problem_id == "valid-parentheses":
                        s_str = args[0] if len(args) > 0 else ""
                        f.write(f'        string s = "{s_str}";\n')
                        f.write('        auto res = sol.isValid(s);\n')
                        f.write('        cout << "RESULT::" << serialize(res) << endl;\n')
                    elif problem_id == "valid-palindrome":
                        s_str = args[0] if len(args) > 0 else ""
                        f.write(f'        string s = {json.dumps(s_str)};\n')
                        f.write('        auto res = sol.isPalindrome(s);\n')
                        f.write('        cout << "RESULT::" << serialize(res) << endl;\n')
                    elif problem_id == "reverse-linked-list":
                        vals = args[0] if len(args) > 0 and isinstance(args[0], list) else []
                        f.write(f"        vector<int> arr = {{{','.join(map(str, vals))}}};\n")
                        f.write('        ListNode* head = buildList(arr);\n')
                        f.write('        auto res = sol.reverseList(head);\n')
                        f.write('        cout << "RESULT::" << serialize(res) << endl;\n')
                    elif problem_id == "invert-binary-tree":
                        vals = [str(x) if x is not None else "null" for x in (args[0] if len(args) > 0 and isinstance(args[0], list) else [])]
                        f.write(f'        vector<string> arr = {{{",".join(f"{json.dumps(v)}" for v in vals)}}};\n')
                        f.write('        TreeNode* root = buildTree(arr);\n')
                        f.write('        auto res = sol.invertTree(root);\n')
                        f.write('        cout << "RESULT::" << serialize(res) << endl;\n')
                    elif problem_id == "maximum-depth-of-binary-tree":
                        vals = [str(x) if x is not None else "null" for x in (args[0] if len(args) > 0 and isinstance(args[0], list) else [])]
                        f.write(f'        vector<string> arr = {{{",".join(f"{json.dumps(v)}" for v in vals)}}};\n')
                        f.write('        TreeNode* root = buildTree(arr);\n')
                        f.write('        auto res = sol.maxDepth(root);\n')
                        f.write('        cout << "RESULT::" << serialize(res) << endl;\n')
                    elif problem_id == "binary-tree-inorder-traversal":
                        vals = [str(x) if x is not None else "null" for x in (args[0] if len(args) > 0 and isinstance(args[0], list) else [])]
                        f.write(f'        vector<string> arr = {{{",".join(f"{json.dumps(v)}" for v in vals)}}};\n')
                        f.write('        TreeNode* root = buildTree(arr);\n')
                        f.write('        auto res = sol.inorderTraversal(root);\n')
                        f.write('        cout << "RESULT::" << serialize(res) << endl;\n')
                    elif problem_id == "3sum":
                        nums = args[0] if len(args) > 0 and isinstance(args[0], list) else []
                        f.write(f"        vector<int> nums = {{{','.join(map(str, nums))}}};\n")
                        f.write('        auto res = sol.threeSum(nums);\n')
                        f.write('        cout << "RESULT::" << serialize(res) << endl;\n')
                    elif problem_id == "group-anagrams":
                        strs = args[0] if len(args) > 0 and isinstance(args[0], list) else []
                        f.write(f'        vector<string> strs = {{{",".join(json.dumps(s) for s in strs)}}};\n')
                        f.write('        auto res = sol.groupAnagrams(strs);\n')
                        f.write('        cout << "RESULT::" << serialize(res) << endl;\n')
                    elif problem_id == "top-k-frequent-elements":
                        nums = args[0] if len(args) > 0 and isinstance(args[0], list) else []
                        k_val = args[1] if len(args) > 1 else 1
                        f.write(f"        vector<int> nums = {{{','.join(map(str, nums))}}};\n")
                        f.write(f"        int k = {k_val};\n")
                        f.write('        auto res = sol.topKFrequent(nums, k);\n')
                        f.write('        cout << "RESULT::" << serialize(res) << endl;\n')
                    elif problem_id == "product-of-array-except-self":
                        nums = args[0] if len(args) > 0 and isinstance(args[0], list) else []
                        f.write(f"        vector<int> nums = {{{','.join(map(str, nums))}}};\n")
                        f.write('        auto res = sol.productExceptSelf(nums);\n')
                        f.write('        cout << "RESULT::" << serialize(res) << endl;\n')
                    elif problem_id == "container-with-most-water":
                        height = args[0] if len(args) > 0 and isinstance(args[0], list) else []
                        f.write(f"        vector<int> height = {{{','.join(map(str, height))}}};\n")
                        f.write('        auto res = sol.maxArea(height);\n')
                        f.write('        cout << "RESULT::" << serialize(res) << endl;\n')
                    elif problem_id == "longest-substring-without-repeating-characters":
                        s_str = args[0] if len(args) > 0 else ""
                        f.write(f'        string s = {json.dumps(s_str)};\n')
                        f.write('        auto res = sol.lengthOfLongestSubstring(s);\n')
                        f.write('        cout << "RESULT::" << serialize(res) << endl;\n')
                    elif problem_id == "climbing-stairs":
                        n_val = args[0] if len(args) > 0 else 1
                        f.write(f"        int n = {n_val};\n")
                        f.write('        auto res = sol.climbStairs(n);\n')
                        f.write('        cout << "RESULT::" << serialize(res) << endl;\n')
                    elif problem_id == "coin-change":
                        coins = args[0] if len(args) > 0 and isinstance(args[0], list) else []
                        amount = args[1] if len(args) > 1 else 0
                        f.write(f"        vector<int> coins = {{{','.join(map(str, coins))}}};\n")
                        f.write(f"        int amount = {amount};\n")
                        f.write('        auto res = sol.coinChange(coins, amount);\n')
                        f.write('        cout << "RESULT::" << serialize(res) << endl;\n')
                    elif problem_id == "merge-intervals":
                        intervals = args[0] if len(args) > 0 and isinstance(args[0], list) else []
                        f.write('        vector<vector<int>> intervals = {\n')
                        for inter in intervals:
                            f.write(f'            {{{inter[0]},{inter[1]}}},\n')
                        f.write('        };\n')
                        f.write('        auto res = sol.merge(intervals);\n')
                        f.write('        cout << "RESULT::" << serialize(res) << endl;\n')
                    elif problem_id == "best-time-to-buy-and-sell-stock":
                        prices = args[0] if len(args) > 0 and isinstance(args[0], list) else []
                        f.write(f"        vector<int> prices = {{{','.join(map(str, prices))}}};\n")
                        f.write('        auto res = sol.maxProfit(prices);\n')
                        f.write('        cout << "RESULT::" << serialize(res) << endl;\n')
                    elif problem_id == "maximum-subarray":
                        nums = args[0] if len(args) > 0 and isinstance(args[0], list) else []
                        f.write(f"        vector<int> nums = {{{','.join(map(str, nums))}}};\n")
                        f.write('        auto res = sol.maxSubArray(nums);\n')
                        f.write('        cout << "RESULT::" << serialize(res) << endl;\n')
                    elif problem_id == "search-in-rotated-sorted-array":
                        nums = args[0] if len(args) > 0 and isinstance(args[0], list) else []
                        target = args[1] if len(args) > 1 else 0
                        f.write(f"        vector<int> nums = {{{','.join(map(str, nums))}}};\n")
                        f.write(f"        int target = {target};\n")
                        f.write('        auto res = sol.search(nums, target);\n')
                        f.write('        cout << "RESULT::" << serialize(res) << endl;\n')
                    elif problem_id == "kth-largest-element-in-an-array":
                        nums = args[0] if len(args) > 0 and isinstance(args[0], list) else []
                        k_val = args[1] if len(args) > 1 else 1
                        f.write(f"        vector<int> nums = {{{','.join(map(str, nums))}}};\n")
                        f.write(f"        int k = {k_val};\n")
                        f.write('        auto res = sol.findKthLargest(nums, k);\n')
                        f.write('        cout << "RESULT::" << serialize(res) << endl;\n')
                    else:
                        f.write('        cout << "RESULT::[]" << endl;\n')
                    f.write("    }\n")
                f.write("    return 0;\n}\n")
            elif "int main(" not in code:
                f.write("\nint main() { return 0; }\n")

        comp_proc = subprocess.run(
            [compiler, *flags, f"solution{ext}", "-o", "solution.exe"],
            cwd=temp_dir,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            timeout=15,
        )

        if comp_proc.returncode != 0:
            err = comp_proc.stderr.replace(temp_dir, "").strip()
            return {
                "status": "Compilation Error",
                "message": err,
                "runtime": 0,
                "testCaseResults": [
                    {
                        "input": tc.input,
                        "expected": tc.expectedOutput,
                        "actual": err,
                        "passed": False,
                        "reason": "Compilation Error",
                        "isHidden": tc.isHidden,
                    }
                    for tc in test_cases
                ],
                "consoleOutput": err,
            }

        try:
            start_time = time.perf_counter()
            run_proc = subprocess.run(
                [exe_file],
                cwd=temp_dir,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True,
                timeout=5,
            )
            duration_ms = max(15, int((time.perf_counter() - start_time) * 1000))
        except (PermissionError, OSError) as os_err:
            return {
                "status": "Runtime Error",
                "message": f"Execution Environment Restriction: {str(os_err)}",
                "runtime": 0,
                "testCaseResults": [
                    {
                        "input": tc.input,
                        "expected": tc.expectedOutput,
                        "actual": f"Execution Restricted: {str(os_err)}",
                        "passed": False,
                        "reason": f"OS Security Policy blocked binary execution: {str(os_err)}",
                        "isHidden": tc.isHidden,
                    }
                    for tc in test_cases
                ],
                "consoleOutput": f"Execution Error: {str(os_err)}",
            }

        if run_proc.returncode != 0:
            return {
                "status": "Runtime Error",
                "message": f"Runtime Error (Exit Code {run_proc.returncode})",
                "runtime": 10,
                "testCaseResults": [
                    {
                        "input": tc.input,
                        "expected": tc.expectedOutput,
                        "actual": f"Crash: Exit Code {run_proc.returncode}",
                        "passed": False,
                        "reason": f"Runtime Crash (Exit Code {run_proc.returncode})",
                        "isHidden": tc.isHidden,
                    }
                    for tc in test_cases
                ],
                "consoleOutput": run_proc.stderr.strip() or f"Process exited with code {run_proc.returncode}",
            }

        lines = run_proc.stdout.strip().split("\n")
        test_results = []
        has_runtime = False

        for idx, tc in enumerate(test_cases):
            line = lines[idx] if idx < len(lines) else "RUNTIME_ERR::No output produced"
            if line.startswith("RESULT::"):
                act_str = line.replace("RESULT::", "").strip()
                passed, reason = compare_actual_expected(act_str, tc.expectedOutput, problem_id)
                test_results.append({
                    "input": tc.input,
                    "expected": tc.expectedOutput,
                    "actual": act_str,
                    "passed": passed,
                    "reason": reason,
                    "isHidden": tc.isHidden,
                })
            elif line.startswith("RUNTIME_ERR::"):
                has_runtime = True
                err_msg = line.replace("RUNTIME_ERR::", "").strip()
                test_results.append({
                    "input": tc.input,
                    "expected": tc.expectedOutput,
                    "actual": f"RuntimeError: {err_msg}",
                    "passed": False,
                    "reason": f"Runtime Error: {err_msg}",
                    "isHidden": tc.isHidden,
                })
            else:
                test_results.append({
                    "input": tc.input,
                    "expected": tc.expectedOutput,
                    "actual": line,
                    "passed": False,
                    "reason": "Execution failure",
                    "isHidden": tc.isHidden,
                })

        passed_count = sum(1 for t in test_results if t["passed"])
        all_passed = passed_count == len(test_results)

        return {
            "status": "Accepted" if all_passed else ("Runtime Error" if has_runtime else "Wrong Answer"),
            "runtime": duration_ms,
            "testCaseResults": test_results,
            "consoleOutput": "All C++ test cases compiled and verified." if all_passed else "Test verification failed.",
        }
    except subprocess.TimeoutExpired:
        return {
            "status": "Time Limit Exceeded",
            "message": "Time Limit Exceeded during C++ execution.",
            "runtime": 5000,
            "testCaseResults": [],
            "consoleOutput": "Time Limit Exceeded",
        }
    except Exception as e:
        return {
            "status": "Compilation Error",
            "message": str(e),
            "runtime": 0,
            "testCaseResults": [],
            "consoleOutput": str(e),
        }
    finally:
        shutil.rmtree(temp_dir, ignore_errors=True)


def execute_sql_code(code: str, problem_id: str, test_cases: List[TestCaseItem]) -> Dict[str, Any]:
    """Executes SQL queries against in-memory SQLite database."""
    conn = sqlite3.connect(":memory:")
    cursor = conn.cursor()

    try:
        # Seed Schema and Tables based on problem_id
        if problem_id == "combine-two-tables":
            cursor.execute("CREATE TABLE Person (personId INTEGER PRIMARY KEY, lastName TEXT, firstName TEXT);")
            cursor.execute("CREATE TABLE Address (addressId INTEGER PRIMARY KEY, personId INTEGER, city TEXT, state TEXT);")
            cursor.execute("INSERT INTO Person VALUES (1, 'Wang', 'Allen'), (2, 'Alice', 'Bob');")
            cursor.execute("INSERT INTO Address VALUES (1, 2, 'New York City', 'New York');")
        elif problem_id == "duplicate-emails":
            cursor.execute("CREATE TABLE Person (id INTEGER PRIMARY KEY, email TEXT);")
            cursor.execute("INSERT INTO Person VALUES (1, 'a@b.com'), (2, 'c@d.com'), (3, 'a@b.com');")
        elif problem_id == "second-highest-salary":
            cursor.execute("CREATE TABLE Employee (id INTEGER PRIMARY KEY, salary INTEGER);")
            cursor.execute("INSERT INTO Employee VALUES (1, 100), (2, 200), (3, 300);")
        elif problem_id == "customers-who-never-order":
            cursor.execute("CREATE TABLE Customers (id INTEGER PRIMARY KEY, name TEXT);")
            cursor.execute("CREATE TABLE Orders (id INTEGER PRIMARY KEY, customerId INTEGER);")
            cursor.execute("INSERT INTO Customers VALUES (1, 'Joe'), (2, 'Henry'), (3, 'Sam'), (4, 'Max');")
            cursor.execute("INSERT INTO Orders VALUES (1, 3), (2, 1);")
        elif problem_id == "department-highest-salary":
            cursor.execute("CREATE TABLE Employee (id INTEGER PRIMARY KEY, name TEXT, salary INTEGER, departmentId INTEGER);")
            cursor.execute("CREATE TABLE Department (id INTEGER PRIMARY KEY, name TEXT);")
            cursor.execute("INSERT INTO Department VALUES (1, 'IT'), (2, 'Sales');")
            cursor.execute("INSERT INTO Employee VALUES (1, 'Joe', 85000, 1), (2, 'Henry', 80000, 2), (3, 'Sam', 60000, 2), (4, 'Max', 90000, 1), (5, 'Janet', 69000, 1);")
        else:
            cursor.execute("CREATE TABLE Person (personId INTEGER PRIMARY KEY, lastName TEXT, firstName TEXT);")
            cursor.execute("CREATE TABLE Address (addressId INTEGER PRIMARY KEY, personId INTEGER, city TEXT, state TEXT);")
            cursor.execute("INSERT INTO Person VALUES (1, 'Wang', 'Allen'), (2, 'Alice', 'Bob');")
            cursor.execute("INSERT INTO Address VALUES (1, 2, 'New York City', 'New York');")

        conn.commit()

        start_time = time.perf_counter()
        cursor.execute(code)
        rows = cursor.fetchall()
        duration_ms = max(10, int((time.perf_counter() - start_time) * 1000))

        test_results = []
        for tc in test_cases:
            passed = False
            actual_str = str(rows)
            reason = "Passed"
            if problem_id == "combine-two-tables":
                passed = len(rows) == 2 and any(r[0] == "Allen" for r in rows)
                actual_str = "Joined Table View" if passed else str(rows)
                if not passed:
                    reason = "Expected Person records LEFT JOIN Address records."
            elif problem_id == "second-highest-salary":
                passed = len(rows) > 0 and (rows[0][0] == 200 or str(rows[0][0]) == "200")
                actual_str = str(rows[0][0]) if rows else "null"
                if not passed:
                    reason = f"Expected 200 but query returned {actual_str}."
            elif problem_id == "duplicate-emails":
                flat_str = " ".join(str(item) for r in rows for item in r).lower()
                passed = len(rows) >= 1 and "a@b.com" in flat_str and "c@d.com" not in flat_str
                actual_str = str([r[0] for r in rows]) if rows else "[]"
                if not passed:
                    reason = "Expected duplicate email 'a@b.com'."
            elif problem_id == "customers-who-never-order":
                flat_str = " ".join(str(item) for r in rows for item in r)
                passed = len(rows) == 2 and "Henry" in flat_str and "Max" in flat_str and "Joe" not in flat_str and "Sam" not in flat_str
                actual_str = str([r[0] for r in rows]) if rows else "[]"
                if not passed:
                    reason = "Expected customers who never ordered ('Henry', 'Max')."
            else:
                passed = len(rows) > 0
                actual_str = str(rows)

            test_results.append(
                {
                    "input": tc.input,
                    "expected": tc.expectedOutput,
                    "actual": actual_str,
                    "passed": passed,
                    "reason": reason,
                    "isHidden": tc.isHidden,
                }
            )

        passed_count = sum(1 for t in test_results if t["passed"])
        all_passed = passed_count == len(test_results)

        return {
            "status": "Accepted" if all_passed else "Wrong Answer",
            "runtime": duration_ms,
            "testCaseResults": test_results,
            "consoleOutput": "SQL Query executed successfully." if all_passed else "SQL Query failed output verification.",
        }
    except sqlite3.OperationalError as op_err:
        msg = f"SQL Syntax Error: {str(op_err)}"
        return {
            "status": "Compilation Error",
            "message": msg,
            "runtime": 0,
            "testCaseResults": [
                {
                    "input": tc.input,
                    "expected": tc.expectedOutput,
                    "actual": msg,
                    "passed": False,
                    "reason": msg,
                    "isHidden": tc.isHidden,
                }
                for tc in test_cases
            ],
            "consoleOutput": msg,
        }
    finally:
        conn.close()


def execute_csharp_code(code: str, problem_id: str, test_cases: List[TestCaseItem]) -> Dict[str, Any]:
    """Compiles and executes C# code using Windows csc.exe compiler."""
    csc_path = shutil.which("csc") or r"C:\Windows\Microsoft.NET\Framework64\v4.0.30319\csc.exe"
    if not os.path.exists(csc_path) and not shutil.which("csc"):
        return {
            "status": "Compilation Error",
            "message": "C# compiler (csc.exe) is not available on this system.",
            "runtime": 0,
            "testCaseResults": [
                {
                    "input": tc.input,
                    "expected": tc.expectedOutput,
                    "actual": "C# compiler not found",
                    "passed": False,
                    "reason": "Compiler Unavailable",
                    "isHidden": tc.isHidden,
                }
                for tc in test_cases
            ],
            "consoleOutput": "C# compiler not found.",
        }

    temp_dir = tempfile.mkdtemp()
    src_file = os.path.join(temp_dir, "Solution.cs")
    exe_file = os.path.join(temp_dir, "Solution.exe")

    try:
        test_inputs_cs = ", ".join(json.dumps(tc.input) for tc in test_cases)
        cs_harness = f"""
using System;
using System.Collections.Generic;
using System.Reflection;
using System.Text.RegularExpressions;

{code}

public class PlaceMentorRunner {{
    public static string Serialize(object obj) {{
        if (obj == null) return "null";
        if (obj is int[]) {{
            return "[" + string.Join(",", (int[])obj) + "]";
        }}
        if (obj is string[]) {{
            return "[\\"" + string.Join("\\",\\"", (string[])obj) + "\\"]";
        }}
        if (obj is bool) {{
            return (bool)obj ? "true" : "false";
        }}
        return obj.ToString();
    }}

    public static object ParseArg(string str, Type targetType) {{
        str = str.trim();
        if (targetType == typeof(int)) return int.Parse(str);
        if (targetType == typeof(long)) return long.Parse(str);
        if (targetType == typeof(double)) return double.Parse(str);
        if (targetType == typeof(bool)) return bool.Parse(str);
        if (targetType == typeof(string)) {{
            if (str.StartsWith("\\"") && str.EndsWith("\\"") && str.Length >= 2) return str.Substring(1, str.Length - 2);
            return str;
        }}
        if (targetType == typeof(int[])) {{
            string s = Regex.Replace(str, @"[\\[\\]\\s]", "");
            if (string.IsNullOrEmpty(s)) return new int[0];
            string[] parts = s.Split(',');
            int[] arr = new int[parts.Length];
            for (int i = 0; i < parts.Length; i++) arr[i] = int.Parse(parts[i]);
            return arr;
        }}
        return str;
    }}

    public static void Main() {{
        string[] testInputs = new string[] {{ {test_inputs_cs} }};
        string problemId = {json.dumps(problem_id)};

        try {{
            Type solType = typeof(Solution);
            object sol = Activator.CreateInstance(solType);
            MethodInfo targetMethod = null;
            foreach (MethodInfo m in solType.GetMethods(BindingFlags.Public | BindingFlags.Instance | BindingFlags.DeclaredOnly)) {{
                targetMethod = m;
                break;
            }}

            if (targetMethod == null) {{
                Console.WriteLine("FATAL_ERR::No solution method found in Solution class");
                return;
            }}

            ParameterInfo[] parameters = targetMethod.GetParameters();

            for (int t = 0; t < testInputs.Length; t++) {{
                string inputStr = testInputs[t].Trim();
                string[] parts = Regex.Split(inputStr, @",\\s*(?=[a-zA-Z_][a-zA-Z0-9_]*\\s*=)");
                object[] invokeArgs = new object[parameters.Length];

                for (int i = 0; i < parameters.Length && i < parts.Length; i++) {{
                    string part = parts[i];
                    int eqIdx = part.IndexOf('=');
                    string valStr = eqIdx >= 0 ? part.Substring(eqIdx + 1).Trim() : part.Trim();
                    invokeArgs[i] = ParseArg(valStr, parameters[i].ParameterType);
                }}

                try {{
                    object actual = targetMethod.Invoke(sol, invokeArgs);
                    Console.WriteLine("RESULT::" + Serialize(actual));
                }} catch (TargetInvocationException tie) {{
                    Exception cause = tie.InnerException != null ? tie.InnerException : tie;
                    Console.WriteLine("RUNTIME_ERR::" + cause.GetType().Name + ": " + cause.Message);
                }}
            }}
        }} catch (Exception ex) {{
            Console.WriteLine("FATAL_ERR::" + ex.Message);
        }}
    }}
}}
"""
        with open(src_file, "w", encoding="utf-8") as f:
            f.write(cs_harness)

        comp_proc = subprocess.run(
            [csc_path, "/nologo", f"/out:{exe_file}", src_file],
            cwd=temp_dir,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            timeout=8,
        )

        if comp_proc.returncode != 0:
            err = comp_proc.stderr.replace(temp_dir, "").strip() or comp_proc.stdout.replace(temp_dir, "").strip()
            return {
                "status": "Compilation Error",
                "message": err,
                "runtime": 0,
                "testCaseResults": [
                    {
                        "input": tc.input,
                        "expected": tc.expectedOutput,
                        "actual": err,
                        "passed": False,
                        "reason": "Compilation Error",
                        "isHidden": tc.isHidden,
                    }
                    for tc in test_cases
                ],
                "consoleOutput": err,
            }

        start_time = time.perf_counter()
        run_proc = subprocess.run(
            [exe_file],
            cwd=temp_dir,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            timeout=5,
        )
        duration_ms = max(20, int((time.perf_counter() - start_time) * 1000))

        lines = run_proc.stdout.strip().split("\n")
        test_results = []
        has_runtime = False

        for idx, tc in enumerate(test_cases):
            line = lines[idx] if idx < len(lines) else "RUNTIME_ERR::No output produced"
            if line.startswith("RESULT::"):
                act_str = line.replace("RESULT::", "").strip()
                passed, reason = compare_actual_expected(act_str, tc.expectedOutput, problem_id)
                test_results.append({
                    "input": tc.input,
                    "expected": tc.expectedOutput,
                    "actual": act_str,
                    "passed": passed,
                    "reason": reason,
                    "isHidden": tc.isHidden,
                })
            elif line.startswith("RUNTIME_ERR::"):
                has_runtime = True
                err_msg = line.replace("RUNTIME_ERR::", "").strip()
                test_results.append({
                    "input": tc.input,
                    "expected": tc.expectedOutput,
                    "actual": f"RuntimeError: {err_msg}",
                    "passed": False,
                    "reason": f"Runtime Error: {err_msg}",
                    "isHidden": tc.isHidden,
                })
            else:
                test_results.append({
                    "input": tc.input,
                    "expected": tc.expectedOutput,
                    "actual": line,
                    "passed": False,
                    "reason": "Execution failure",
                    "isHidden": tc.isHidden,
                })

        passed_count = sum(1 for t in test_results if t["passed"])
        all_passed = passed_count == len(test_results)

        return {
            "status": "Accepted" if all_passed else ("Runtime Error" if has_runtime else "Wrong Answer"),
            "runtime": duration_ms,
            "testCaseResults": test_results,
            "consoleOutput": "All C# test cases verified." if all_passed else "Test verification failed.",
        }
    except subprocess.TimeoutExpired:
        return {
            "status": "Time Limit Exceeded",
            "message": "Time Limit Exceeded during C# execution.",
            "runtime": 5000,
            "testCaseResults": [],
            "consoleOutput": "Time Limit Exceeded",
        }
    except Exception as e:
        return {
            "status": "Compilation Error",
            "message": str(e),
            "runtime": 0,
            "testCaseResults": [],
            "consoleOutput": str(e),
        }
    finally:
        shutil.rmtree(temp_dir, ignore_errors=True)


def is_starter_or_empty(code: str) -> bool:
    if not code:
        return True
    trimmed = code.strip()
    if not trimmed:
        return True

    # Strip comments
    clean = re.sub(r'#.*$', '', trimmed, flags=re.MULTILINE)
    clean = re.sub(r'//.*$', '', clean, flags=re.MULTILINE)
    clean = re.sub(r'--.*$', '', clean, flags=re.MULTILINE)
    clean = re.sub(r'/\*[\s\S]*?\*/', '', clean)
    clean = re.sub(r'"""[\s\S]*?"""', '', clean)
    clean = re.sub(r"'''[\s\S]*?'''", '', clean)

    cleaned_lines = [l.strip() for l in clean.split('\n') if l.strip()]
    if not cleaned_lines:
        return True

    # If code only contains signatures, headers, braces, or pass
    if all(
        l.startswith((
            "class ", "def ", "public ", "static ", "void ", "import ", "from ",
            "package ", "using ", "#include", "int ", "vector<", "/**", "*/", "*",
            "function ", "-- SQL is not supported", "// Write your", "# Write your"
        )) or l in ("pass", "{}", "{", "};", "}", ";", "pass;")
        for l in cleaned_lines
    ):
        return True

    return False


@router.post("", response_model=ExecutionResponse)
async def execute_code(
    req: ExecutionRequest,
    current_user: Optional[dict] = Depends(get_optional_current_user),
):
    """Universal Code Judge Endpoint with Backend Hidden Test Cases & Persistence."""
    from app.services.problems_service import get_problem_test_cases, record_user_submission

    code = req.code.strip()
    lang = req.language.lower()
    problem_id = req.problemId
    is_submit = bool(req.isSubmit or req.mode == "submit")
    # Security: derive authenticated user_id from verified JWT session ONLY (never trust client userId)
    user_id = current_user.get("id") if (current_user and current_user.get("id")) else None

    # In submit mode, load the complete test suite (visible + hidden) from backend registry
    if is_submit:
        backend_cases = get_problem_test_cases(problem_id, include_hidden=True)
        if backend_cases:
            test_cases = [TestCaseItem(**c) for c in backend_cases]
        else:
            test_cases = req.testCases
    else:
        if req.testCases and len(req.testCases) > 0:
            test_cases = [tc for tc in req.testCases if not tc.isHidden]
        else:
            backend_visible = get_problem_test_cases(problem_id, include_hidden=False)
            test_cases = [TestCaseItem(**c) for c in backend_visible] if backend_visible else []

    # 1. Empty / Untouched Starter Code Check
    if is_starter_or_empty(code):
        return ExecutionResponse(
            status="Need Solution",
            isSubmit=is_submit,
            message="Write your solution before submitting." if is_submit else "Write your solution before running the test cases.",
            runtime=0,
            memory=0,
            passedCount=0,
            totalCount=len(test_cases),
            visiblePassed=0,
            visibleTotal=sum(1 for t in test_cases if not t.isHidden),
            hiddenPassed=0,
            hiddenTotal=sum(1 for t in test_cases if t.isHidden),
            testCaseResults=[],
            consoleOutput="Write your solution before running.",
        )

    # 2. Check for SQL on non-SQL problem
    if lang == "sql" and problem_id not in SQL_PROBLEMS:
        msg = "Language Not Supported: SQL is not supported for this algorithmic problem."
        return ExecutionResponse(
            status="Compilation Error",
            isSubmit=is_submit,
            message=msg,
            runtime=0,
            memory=0,
            passedCount=0,
            totalCount=len(test_cases),
            visiblePassed=0,
            visibleTotal=sum(1 for t in test_cases if not t.isHidden),
            hiddenPassed=0,
            hiddenTotal=sum(1 for t in test_cases if t.isHidden),
            testCaseResults=[
                {
                    "input": tc.input,
                    "expected": tc.expectedOutput,
                    "actual": msg,
                    "passed": False,
                    "reason": msg,
                    "isHidden": tc.isHidden,
                }
                for tc in test_cases
            ],
            consoleOutput=msg,
        )

    # 3. Select Language Runner
    if lang in ("python3", "python", "numpy"):
        res = execute_python_code(code, problem_id, test_cases)
    elif lang in ("javascript", "typescript", "ts", "js"):
        res = execute_javascript_code(code, problem_id, test_cases)
    elif lang in ("java", "java17"):
        res = execute_java_code(code, problem_id, test_cases)
    elif lang in ("cpp",):
        res = execute_cpp_code(code, problem_id, test_cases, is_c=False)
    elif lang in ("c",):
        res = execute_cpp_code(code, problem_id, test_cases, is_c=True)
    elif lang in ("csharp", "cs", "c#"):
        res = execute_csharp_code(code, problem_id, test_cases)
    elif lang in ("sql",):
        res = execute_sql_code(code, problem_id, test_cases)
    else:
        res = execute_python_code(code, problem_id, test_cases)

    # 4. Aggregate totals & Enforce Acceptance Rule
    test_results = res.get("testCaseResults", [])
    total_count = len(test_cases)
    passed_count = sum(1 for t in test_results if t.get("passed", False))
    visible_total = sum(1 for t in test_cases if not t.isHidden)
    visible_passed = sum(1 for t in test_results if not t.get("isHidden", False) and t.get("passed", False))
    hidden_total = sum(1 for t in test_cases if t.isHidden)
    hidden_passed = sum(1 for t in test_results if t.get("isHidden", False) and t.get("passed", False))

    raw_status = res.get("status", "Wrong Answer")
    if raw_status in ("Compilation Error", "Runtime Error", "Time Limit Exceeded", "Memory Limit Exceeded"):
        final_status = raw_status
    elif total_count > 0 and passed_count == total_count:
        final_status = "Accepted"
    else:
        final_status = "Wrong Answer"

    # 5. Sanitize hidden test cases for security before sending to client
    sanitized_results = []
    for r in test_results:
        r_copy = dict(r)
        if r_copy.get("isHidden"):
            r_copy["input"] = "[Hidden Test Case]"
            r_copy["expected"] = "[Hidden]"
            if not r_copy.get("passed"):
                r_copy["actual"] = "Wrong answer on hidden test case"
            else:
                r_copy["actual"] = "[Passed]"
        sanitized_results.append(r_copy)

    # 6. If Submit mode, persist to MongoDB for authenticated user
    if is_submit and user_id and user_id not in ("anonymous", "default-user"):
        try:
            await record_user_submission(
                user_id=user_id,
                problem_id=problem_id,
                language=lang,
                code=code,
                status=final_status,
                runtime=res.get("runtime", 25),
                memory=14.2,
                passed_count=passed_count,
                total_count=total_count,
                visible_passed=visible_passed,
                visible_total=visible_total,
                hidden_passed=hidden_passed,
                hidden_total=hidden_total,
                test_case_results=sanitized_results,
                error_message=res.get("message"),
                console_output=res.get("consoleOutput", ""),
            )
        except Exception:
            pass

    return ExecutionResponse(
        status=final_status,
        isSubmit=is_submit,
        message=res.get("message"),
        runtime=res.get("runtime", 25),
        memory=14.2,
        passedCount=passed_count,
        totalCount=total_count,
        passed_count=passed_count,
        total_count=total_count,
        visiblePassed=visible_passed,
        visibleTotal=visible_total,
        hiddenPassed=hidden_passed,
        hiddenTotal=hidden_total,
        testCaseResults=sanitized_results,
        consoleOutput=res.get("consoleOutput", ""),
    )
