from routes.execution import (
    execute_python_code,
    execute_javascript_code,
    execute_java_code,
    execute_cpp_code,
    execute_sql_code,
    TestCaseItem,
)

two_sum_test_cases = [
    TestCaseItem(input="nums = [2,7,11,15], target = 9", expectedOutput="[0,1]"),
    TestCaseItem(input="nums = [3,2,4], target = 6", expectedOutput="[1,2]"),
    TestCaseItem(input="nums = [3,3], target = 6", expectedOutput="[0,1]"),
]

hidden_test_cases = [
    TestCaseItem(input="nums = [-1,-2,-3,-4,-5], target = -8", expectedOutput="[2,4]", isHidden=True),
    TestCaseItem(input="nums = [0,4,3,0], target = 0", expectedOutput="[0,3]", isHidden=True),
]

def test_two_sum_python():
    # A. Correct brute-force
    bf_code = """
class Solution:
    def twoSum(self, nums: list[int], target: int) -> list[int]:
        for i in range(len(nums)):
            for j in range(i + 1, len(nums)):
                if nums[i] + nums[j] == target:
                    return [i, j]
        return []
"""
    res = execute_python_code(bf_code, "two-sum", two_sum_test_cases)
    assert res["status"] == "Accepted", f"Python BF expected Accepted, got {res['status']}"

    # B. Correct HashMap
    hm_code = """
class Solution:
    def twoSum(self, nums: list[int], target: int) -> list[int]:
        seen = {}
        for i, num in enumerate(nums):
            comp = target - num
            if comp in seen:
                return [seen[comp], i]
            seen[num] = i
        return []
"""
    res = execute_python_code(hm_code, "two-sum", two_sum_test_cases)
    assert res["status"] == "Accepted", f"Python HM expected Accepted, got {res['status']}"

    # C. Deliberately wrong solution
    wrong_code = """
class Solution:
    def twoSum(self, nums: list[int], target: int) -> list[int]:
        return [0, 0]
"""
    res = execute_python_code(wrong_code, "two-sum", two_sum_test_cases)
    assert res["status"] == "Wrong Answer", f"Python wrong expected Wrong Answer, got {res['status']}"
    assert res["testCaseResults"][0]["passed"] is False
    assert res["testCaseResults"][0]["actual"] == "[0,0]"
    assert res["testCaseResults"][0]["expected"] == "[0,1]"

    # D. Syntax error
    syn_code = """
class Solution:
    def twoSum(self, nums: list[int], target: int) -> list[int]:
        if x > 0
            return [0, 1]
"""
    res = execute_python_code(syn_code, "two-sum", two_sum_test_cases)
    assert res["status"] == "Compilation Error", f"Python syntax expected Compilation Error, got {res['status']}"
    assert "SyntaxError" in res["message"]

    # E. Runtime error
    rt_code = """
class Solution:
    def twoSum(self, nums: list[int], target: int) -> list[int]:
        return nums[1000]
"""
    res = execute_python_code(rt_code, "two-sum", two_sum_test_cases)
    assert res["status"] == "Runtime Error", f"Python runtime expected Runtime Error, got {res['status']}"
    assert "IndexError" in res["testCaseResults"][0]["actual"]


def test_two_sum_javascript():
    # A & B. Correct HashMap
    js_correct = """
function twoSum(nums, target) {
    const map = new Map();
    for (let i = 0; i < nums.length; i++) {
        const comp = target - nums[i];
        if (map.has(comp)) return [map.get(comp), i];
        map.set(nums[i], i);
    }
    return [];
}
"""
    res = execute_javascript_code(js_correct, "two-sum", two_sum_test_cases)
    assert res["status"] == "Accepted", f"JS expected Accepted, got {res['status']}"

    # C. Deliberately wrong
    js_wrong = "function twoSum(nums, target) { return [0, 0]; }"
    res = execute_javascript_code(js_wrong, "two-sum", two_sum_test_cases)
    assert res["status"] == "Wrong Answer", f"JS wrong expected Wrong Answer, got {res['status']}"
    assert res["testCaseResults"][0]["actual"] == "[0,0]"

    # D. Syntax Error
    js_syn = "function twoSum(nums, target) { if (x > 0 return [0, 1]; }"
    res = execute_javascript_code(js_syn, "two-sum", two_sum_test_cases)
    assert res["status"] == "Compilation Error", f"JS syntax expected Compilation Error, got {res['status']}"

    # E. Runtime Error
    js_rt = "function twoSum(nums, target) { null.someMethod(); }"
    res = execute_javascript_code(js_rt, "two-sum", two_sum_test_cases)
    assert res["status"] == "Runtime Error", f"JS runtime expected Runtime Error, got {res['status']}"


def test_two_sum_java():
    # A & B. Correct Solution
    java_correct = """
class Solution {
    public int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int comp = target - nums[i];
            if (map.containsKey(comp)) {
                return new int[] { map.get(comp), i };
            }
            map.put(nums[i], i);
        }
        return new int[0];
    }
}
"""
    res = execute_java_code(java_correct, "two-sum", two_sum_test_cases)
    assert res["status"] == "Accepted", f"Java expected Accepted, got {res['status']}"

    # C. Deliberately wrong
    java_wrong = """
class Solution {
    public int[] twoSum(int[] nums, int target) {
        return new int[] { 0, 0 };
    }
}
"""
    res = execute_java_code(java_wrong, "two-sum", two_sum_test_cases)
    assert res["status"] == "Wrong Answer", f"Java wrong expected Wrong Answer, got {res['status']}"
    assert res["testCaseResults"][0]["actual"] == "[0,0]"

    # D. Syntax Error
    java_syn = "class Solution { public int[] twoSum(int[] nums, int target) { if (x > 0 return new int[0]; } }"
    res = execute_java_code(java_syn, "two-sum", two_sum_test_cases)
    assert res["status"] == "Compilation Error", f"Java syntax expected Compilation Error, got {res['status']}"

    # E. Runtime Error
    java_rt = """
class Solution {
    public int[] twoSum(int[] nums, int target) {
        return new int[] { nums[100] };
    }
}
"""
    res = execute_java_code(java_rt, "two-sum", two_sum_test_cases)
    assert res["status"] == "Runtime Error", f"Java runtime expected Runtime Error, got {res['status']}"


def test_two_sum_cpp():
    # A & B. Correct Solution
    cpp_correct = """
class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        unordered_map<int, int> seen;
        for (int i = 0; i < nums.size(); i++) {
            int comp = target - nums[i];
            if (seen.count(comp)) return {seen[comp], i};
            seen[nums[i]] = i;
        }
        return {};
    }
};
"""
    res = execute_cpp_code(cpp_correct, "two-sum", two_sum_test_cases)
    assert res["status"] == "Accepted", f"C++ expected Accepted, got {res['status']}"

    # C. Deliberately wrong
    cpp_wrong = """
class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        return {0, 0};
    }
};
"""
    res = execute_cpp_code(cpp_wrong, "two-sum", two_sum_test_cases)
    assert res["status"] == "Wrong Answer", f"C++ wrong expected Wrong Answer, got {res['status']}"

    # D. Syntax Error
    cpp_syn = "class Solution { public: vector<int> twoSum(vector<int>& nums, int target) { if (x > 0 return {}; } };"
    res = execute_cpp_code(cpp_syn, "two-sum", two_sum_test_cases)
    assert res["status"] == "Compilation Error", f"C++ syntax expected Compilation Error, got {res['status']}"


def test_sql_judge():
    combine_tcs = [
        TestCaseItem(input="Person and Address tables", expectedOutput="Joined records"),
        TestCaseItem(input="Null address handling", expectedOutput="Person with null city/state", isHidden=True),
    ]

    # Correct Query
    sql_correct = "SELECT firstName, lastName, city, state FROM Person LEFT JOIN Address ON Person.personId = Address.personId;"
    res = execute_sql_code(sql_correct, "combine-two-tables", combine_tcs)
    assert res["status"] == "Accepted", f"SQL combine-two-tables expected Accepted, got {res['status']}"

    # Wrong Query (Inner Join that drops rows without addresses or wrong columns)
    sql_wrong = "SELECT firstName FROM Person WHERE personId = 999;"
    res = execute_sql_code(sql_wrong, "combine-two-tables", combine_tcs)
    assert res["status"] == "Wrong Answer", f"SQL wrong expected Wrong Answer, got {res['status']}"

    # Syntax Error Query
    sql_syn = "SELEKT * FORM Person"
    res = execute_sql_code(sql_syn, "combine-two-tables", combine_tcs)
    assert res["status"] == "Compilation Error", f"SQL syntax error expected Compilation Error, got {res['status']}"

    # Second highest salary test
    shs_tcs = [
        TestCaseItem(input="Employee table", expectedOutput="200"),
        TestCaseItem(input="Hidden offset test", expectedOutput="200", isHidden=True),
    ]
    shs_correct = "SELECT MAX(salary) AS SecondHighestSalary FROM Employee WHERE salary < (SELECT MAX(salary) FROM Employee);"
    res = execute_sql_code(shs_correct, "second-highest-salary", shs_tcs)
    assert res["status"] == "Accepted", f"SQL second-highest-salary expected Accepted, got {res['status']}"

    # Duplicate emails test
    dup_tcs = [
        TestCaseItem(input="Person table", expectedOutput="['a@b.com']"),
        TestCaseItem(input="Hidden counts", expectedOutput="['a@b.com']", isHidden=True),
    ]
    dup_correct = "SELECT email FROM Person GROUP BY email HAVING COUNT(email) > 1;"
    res = execute_sql_code(dup_correct, "duplicate-emails", dup_tcs)
    assert res["status"] == "Accepted", f"SQL duplicate-emails expected Accepted, got {res['status']}"

    # Customers who never order test
    cust_tcs = [
        TestCaseItem(input="Customers and Orders tables", expectedOutput="Henry, Max"),
        TestCaseItem(input="Hidden customer check", expectedOutput="Henry, Max", isHidden=True),
    ]
    cust_correct = "SELECT name AS Customers FROM Customers LEFT JOIN Orders ON Customers.id = Orders.customerId WHERE Orders.customerId IS NULL;"
    res = execute_sql_code(cust_correct, "customers-who-never-order", cust_tcs)
    assert res["status"] == "Accepted", f"SQL customers-who-never-order expected Accepted, got {res['status']}"


if __name__ == "__main__":
    print("Testing Python Judge...")
    test_two_sum_python()
    print("Testing JavaScript Judge...")
    test_two_sum_javascript()
    print("Testing Java Judge...")
    test_two_sum_java()
    print("Testing C++ Judge...")
    test_two_sum_cpp()
    print("Testing SQL Judge...")
    test_sql_judge()
    print("\nALL MULTI-LANGUAGE REAL JUDGE TESTS PASSED (Python, JS, Java, C++, SQL)!")

