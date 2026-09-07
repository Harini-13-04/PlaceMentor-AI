"""
PlaceMentor AI — Problem Catalog & Hidden Test Engine
Stores 24+ official placement coding problems across Algorithms, Data Structures, and SQL.
Sanitizes problem data so hidden tests are never exposed over the network.
"""

from typing import List, Dict, Any, Optional
from datetime import datetime, timezone
import uuid
from app.database.mongodb import (
    user_problems_collection,
    coding_submissions_collection,
)

# Complete Problem Dataset (24 Problems) with Backend-Only Hidden Test Cases
PROBLEMS_DATA: List[Dict[str, Any]] = [
    # 1. Two Sum
    {
        "id": "two-sum",
        "title": "Two Sum",
        "difficulty": "Easy",
        "category": "Algorithms & DSA",
        "topic": "Arrays & Hash Map",
        "companies": ["Amazon", "Google", "Microsoft", "TCS", "Infosys", "Zoho"],
        "acceptanceRate": "51.4%",
        "description": "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\nYou can return the answer in any order.",
        "examples": [
            {"input": "nums = [2,7,11,15], target = 9", "output": "[0,1]", "explanation": "Because nums[0] + nums[1] == 9, we return [0, 1]."},
            {"input": "nums = [3,2,4], target = 6", "output": "[1,2]", "explanation": "nums[1] + nums[2] == 6, return [1, 2]."},
            {"input": "nums = [3,3], target = 6", "output": "[0,1]"}
        ],
        "constraints": [
            "2 <= nums.length <= 10^4",
            "-10^9 <= nums[i] <= 10^9",
            "-10^9 <= target <= 10^9",
            "Only one valid answer exists."
        ],
        "hints": [
            "A brute force search checks all pairs in O(n²). Can you look up complements in O(1)?",
            "Use a Hash Map to store previously visited elements and their indices.",
            "As you iterate, check if `target - num` exists in the hash map. If so, return current index and stored index."
        ],
        "optimalApproach": [
            "Initialize an empty Hash Map `seen = {}`.",
            "Iterate through `nums` with index `i` and value `num`.",
            "Calculate `complement = target - num`.",
            "If `complement` is in `seen`, return `[seen[complement], i]`.",
            "Otherwise, record `seen[num] = i`."
        ],
        "timeComplexity": "O(n) — single pass through array with O(1) hash lookups.",
        "spaceComplexity": "O(n) — auxiliary hash map storage.",
        "testCases": [
            {"input": "nums = [2,7,11,15], target = 9", "expectedOutput": "[0,1]"},
            {"input": "nums = [3,2,4], target = 6", "expectedOutput": "[1,2]"},
            {"input": "nums = [3,3], target = 6", "expectedOutput": "[0,1]"}
        ],
        "hiddenTestCases": [
            {"input": "nums = [-1,-2,-3,-4,-5], target = -8", "expectedOutput": "[2,4]", "isHidden": True},
            {"input": "nums = [0,4,3,0], target = 0", "expectedOutput": "[0,3]", "isHidden": True},
            {"input": "nums = [1000000000,2000000000], target = 3000000000", "expectedOutput": "[0,1]", "isHidden": True},
            {"input": "nums = [5,75,25], target = 100", "expectedOutput": "[1,2]", "isHidden": True},
            {"input": "nums = [-10,-1,-18,-19], target = -19", "expectedOutput": "[1,2]", "isHidden": True}
        ]
    },

    # 2. Contains Duplicate
    {
        "id": "contains-duplicate",
        "title": "Contains Duplicate",
        "difficulty": "Easy",
        "category": "Algorithms & DSA",
        "topic": "Arrays & Hash Set",
        "companies": ["Amazon", "Microsoft", "Accenture", "Wipro", "TCS", "Cognizant"],
        "acceptanceRate": "62.1%",
        "description": "Given an integer array `nums`, return `true` if any value appears at least twice in the array, and return `false` if every element is distinct.",
        "examples": [
            {"input": "nums = [1,2,3,1]", "output": "true"},
            {"input": "nums = [1,2,3,4]", "output": "false"},
            {"input": "nums = [1,1,1,3,3,4,3,2,4,2]", "output": "true"}
        ],
        "constraints": ["1 <= nums.length <= 10^5", "-10^9 <= nums[i] <= 10^9"],
        "hints": [
            "Can we use a Hash Set to track seen numbers in O(1) time per item?",
            "If the set size after inserting all numbers is less than array length, duplicates exist."
        ],
        "optimalApproach": [
            "Maintain a Hash Set of seen numbers.",
            "Iterate through the array. If the number is already in the set, return `true`.",
            "If iteration finishes without duplicates, return `false`."
        ],
        "timeComplexity": "O(n)",
        "spaceComplexity": "O(n)",
        "testCases": [
            {"input": "nums = [1,2,3,1]", "expectedOutput": "true"},
            {"input": "nums = [1,2,3,4]", "expectedOutput": "false"},
            {"input": "nums = [1,1,1,3,3,4,3,2,4,2]", "expectedOutput": "true"}
        ],
        "hiddenTestCases": [
            {"input": "nums = [0]", "expectedOutput": "false", "isHidden": True},
            {"input": "nums = [1000000000, -1000000000, 1000000000]", "expectedOutput": "true", "isHidden": True},
            {"input": "nums = [1,2,3,4,5,6,7,8,9,10]", "expectedOutput": "false", "isHidden": True},
            {"input": "nums = [99, 99]", "expectedOutput": "true", "isHidden": True}
        ]
    },

    # 3. Valid Anagram
    {
        "id": "valid-anagram",
        "title": "Valid Anagram",
        "difficulty": "Easy",
        "category": "Algorithms & DSA",
        "topic": "Strings",
        "companies": ["Google", "Amazon", "Cognizant", "TCS", "Capgemini", "Freshworks"],
        "acceptanceRate": "64.3%",
        "description": "Given two strings `s` and `t`, return `true` if `t` is an anagram of `s`, and `false` otherwise.\n\nAn Anagram is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.",
        "examples": [
            {"input": 's = "anagram", t = "nagaram"', "output": "true"},
            {"input": 's = "rat", t = "car"', "output": "false"}
        ],
        "constraints": ["1 <= s.length, t.length <= 5 * 10^4", "s and t consist of lowercase English letters."],
        "hints": [
            "If lengths differ, can they ever be anagrams?",
            "Count letter frequencies using a fixed 26-character array or hash map."
        ],
        "optimalApproach": [
            "If len(s) != len(t), return false immediately.",
            "Count characters of s and subtract for t.",
            "If all counts reach 0, return true."
        ],
        "timeComplexity": "O(n)",
        "spaceComplexity": "O(1) - alphabet size is 26.",
        "testCases": [
            {"input": 's = "anagram", t = "nagaram"', "expectedOutput": "true"},
            {"input": 's = "rat", t = "car"', "expectedOutput": "false"}
        ],
        "hiddenTestCases": [
            {"input": 's = "a", t = "a"', "expectedOutput": "true", "isHidden": True},
            {"input": 's = "ab", t = "a"', "expectedOutput": "false", "isHidden": True},
            {"input": 's = "listen", t = "silent"', "expectedOutput": "true", "isHidden": True},
            {"input": 's = "triangle", t = "integral"', "expectedOutput": "true", "isHidden": True}
        ]
    },

    # 4. Valid Parentheses
    {
        "id": "valid-parentheses",
        "title": "Valid Parentheses",
        "difficulty": "Easy",
        "category": "Algorithms & DSA",
        "topic": "Stacks",
        "companies": ["Amazon", "Microsoft", "Google", "TCS", "Infosys", "Wipro"],
        "acceptanceRate": "40.5%",
        "description": "Given a string `s` containing just the characters `'('`, `')'`, `'{'`, `'}'`, `'['` and `']'`, determine if the input string is valid.\n\nAn input string is valid if open brackets are closed by the same type of brackets in the correct order.",
        "examples": [
            {"input": 's = "()"', "output": "true"},
            {"input": 's = "()[]{}"', "output": "true"},
            {"input": 's = "(]"', "output": "false"}
        ],
        "constraints": ["1 <= s.length <= 10^4", "s consists of parentheses only."],
        "hints": ["Use a stack to match opening brackets with corresponding closing brackets."],
        "optimalApproach": [
            "Push opening brackets onto stack.",
            "On closing bracket, check if top matches. If not or stack empty, return false.",
            "Return true if stack is empty at end."
        ],
        "timeComplexity": "O(n)",
        "spaceComplexity": "O(n)",
        "testCases": [
            {"input": 's = "()"', "expectedOutput": "true"},
            {"input": 's = "()[]{}"', "expectedOutput": "true"},
            {"input": 's = "(]"', "expectedOutput": "false"}
        ],
        "hiddenTestCases": [
            {"input": 's = "([)]"', "expectedOutput": "false", "isHidden": True},
            {"input": 's = "{[]}"', "expectedOutput": "true", "isHidden": True},
            {"input": 's = "["', "expectedOutput": "false", "isHidden": True},
            {"input": 's = "]"', "expectedOutput": "false", "isHidden": True},
            {"input": 's = "(((((((())))))))"', "expectedOutput": "true", "isHidden": True}
        ]
    },

    # 5. Reverse Linked List
    {
        "id": "reverse-linked-list",
        "title": "Reverse Linked List",
        "difficulty": "Easy",
        "category": "Algorithms & DSA",
        "topic": "Linked Lists",
        "companies": ["Amazon", "Microsoft", "TCS", "Zoho", "Cognizant"],
        "acceptanceRate": "74.8%",
        "description": "Given the `head` of a singly linked list, reverse the list, and return the reversed list.",
        "examples": [
            {"input": "head = [1,2,3,4,5]", "output": "[5,4,3,2,1]"},
            {"input": "head = [1,2]", "output": "[2,1]"},
            {"input": "head = []", "output": "[]"}
        ],
        "constraints": ["The number of nodes in the list is in the range [0, 5000].", "-5000 <= Node.val <= 5000"],
        "hints": ["Iterate through list keeping track of previous, current, and next nodes."],
        "optimalApproach": ["Set prev = None, curr = head. In loop, next = curr.next, curr.next = prev, prev = curr, curr = next."],
        "timeComplexity": "O(n)",
        "spaceComplexity": "O(1)",
        "testCases": [
            {"input": "head = [1,2,3,4,5]", "expectedOutput": "[5,4,3,2,1]"},
            {"input": "head = [1,2]", "expectedOutput": "[2,1]"},
            {"input": "head = []", "expectedOutput": "[]"}
        ],
        "hiddenTestCases": [
            {"input": "head = [1]", "expectedOutput": "[1]", "isHidden": True},
            {"input": "head = [9,8,7,6]", "expectedOutput": "[6,7,8,9]", "isHidden": True},
            {"input": "head = [-1,0,1]", "expectedOutput": "[1,0,-1]", "isHidden": True}
        ]
    },

    # 6. Best Time to Buy and Sell Stock
    {
        "id": "best-time-to-buy-and-sell-stock",
        "title": "Best Time to Buy and Sell Stock",
        "difficulty": "Easy",
        "category": "Algorithms & DSA",
        "topic": "Arrays & Greedy",
        "companies": ["Amazon", "Microsoft", "Google", "TCS", "Infosys"],
        "acceptanceRate": "54.2%",
        "description": "You are given an array `prices` where `prices[i]` is the price of a given stock on the `i`th day. You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock. Return the maximum profit you can achieve from this transaction.",
        "examples": [
            {"input": "prices = [7,1,5,3,6,4]", "output": "5"},
            {"input": "prices = [7,6,4,3,1]", "output": "0"}
        ],
        "constraints": ["1 <= prices.length <= 10^5", "0 <= prices[i] <= 10^4"],
        "hints": ["Keep track of the minimum price seen so far and calculate max profit at each step."],
        "optimalApproach": ["min_price = float('inf'), max_profit = 0. For price in prices: min_price = min(min_price, price); max_profit = max(max_profit, price - min_price)."],
        "timeComplexity": "O(n)",
        "spaceComplexity": "O(1)",
        "testCases": [
            {"input": "prices = [7,1,5,3,6,4]", "expectedOutput": "5"},
            {"input": "prices = [7,6,4,3,1]", "expectedOutput": "0"}
        ],
        "hiddenTestCases": [
            {"input": "prices = [2,4,1]", "expectedOutput": "2", "isHidden": True},
            {"input": "prices = [1,2]", "expectedOutput": "1", "isHidden": True},
            {"input": "prices = [3,3,3,3]", "expectedOutput": "0", "isHidden": True},
            {"input": "prices = [1,4,2,8,4,9]", "expectedOutput": "8", "isHidden": True}
        ]
    },

    # 7. Maximum Subarray
    {
        "id": "maximum-subarray",
        "title": "Maximum Subarray",
        "difficulty": "Medium",
        "category": "Algorithms & DSA",
        "topic": "Dynamic Programming",
        "companies": ["Amazon", "Microsoft", "Google", "TCS", "Cognizant"],
        "acceptanceRate": "50.8%",
        "description": "Given an integer array `nums`, find the subarray with the largest sum, and return its sum (Kadane's Algorithm).",
        "examples": [
            {"input": "nums = [-2,1,-3,4,-1,2,1,-5,4]", "output": "6"},
            {"input": "nums = [1]", "output": "1"},
            {"input": "nums = [5,4,-1,7,8]", "output": "23"}
        ],
        "constraints": ["1 <= nums.length <= 10^5", "-10^4 <= nums[i] <= 10^4"],
        "hints": ["Kadane's Algorithm: curr_sum = max(num, curr_sum + num)."],
        "optimalApproach": ["Track curr_sum and max_sum in a single pass."],
        "timeComplexity": "O(n)",
        "spaceComplexity": "O(1)",
        "testCases": [
            {"input": "nums = [-2,1,-3,4,-1,2,1,-5,4]", "expectedOutput": "6"},
            {"input": "nums = [1]", "expectedOutput": "1"},
            {"input": "nums = [5,4,-1,7,8]", "expectedOutput": "23"}
        ],
        "hiddenTestCases": [
            {"input": "nums = [-1]", "expectedOutput": "-1", "isHidden": True},
            {"input": "nums = [-2,-1]", "expectedOutput": "-1", "isHidden": True},
            {"input": "nums = [1,2,3,4]", "expectedOutput": "10", "isHidden": True},
            {"input": "nums = [-5,10,-2,8,-20,15]", "expectedOutput": "16", "isHidden": True}
        ]
    },

    # 8. Binary Tree Inorder Traversal
    {
        "id": "binary-tree-inorder-traversal",
        "title": "Binary Tree Inorder Traversal",
        "difficulty": "Easy",
        "category": "Algorithms & DSA",
        "topic": "Trees",
        "companies": ["Amazon", "Microsoft", "TCS", "Infosys"],
        "acceptanceRate": "74.5%",
        "description": "Given the `root` of a binary tree, return the inorder traversal of its nodes' values.",
        "examples": [
            {"input": "root = [1,null,2,3]", "output": "[1,3,2]"},
            {"input": "root = []", "output": "[]"},
            {"input": "root = [1]", "output": "[1]"}
        ],
        "constraints": ["The number of nodes in the tree is in the range [0, 100].", "-100 <= Node.val <= 100"],
        "hints": ["Inorder traversal visits: Left -> Root -> Right."],
        "optimalApproach": ["Recursive or iterative using a stack."],
        "timeComplexity": "O(n)",
        "spaceComplexity": "O(n)",
        "testCases": [
            {"input": "root = [1,null,2,3]", "expectedOutput": "[1,3,2]"},
            {"input": "root = []", "expectedOutput": "[]"},
            {"input": "root = [1]", "expectedOutput": "[1]"}
        ],
        "hiddenTestCases": [
            {"input": "root = [1,2,3,4,5]", "expectedOutput": "[4,2,5,1,3]", "isHidden": True},
            {"input": "root = [3,1,2]", "expectedOutput": "[1,3,2]", "isHidden": True}
        ]
    },

    # 9. Climbing Stairs
    {
        "id": "climbing-stairs",
        "title": "Climbing Stairs",
        "difficulty": "Easy",
        "category": "Algorithms & DSA",
        "topic": "Dynamic Programming",
        "companies": ["Amazon", "Google", "Adobe", "TCS", "Accenture"],
        "acceptanceRate": "53.8%",
        "description": "You are climbing a staircase. It takes `n` steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?",
        "examples": [
            {"input": "n = 2", "output": "2", "explanation": "1. 1 step + 1 step\n2. 2 steps"},
            {"input": "n = 3", "output": "3", "explanation": "1. 1 + 1 + 1\n2. 1 + 2\n3. 2 + 1"}
        ],
        "constraints": ["1 <= n <= 45"],
        "hints": ["To reach step n, you can take a single step from n-1 or a 2-step jump from n-2.", "Ways(n) = Ways(n-1) + Ways(n-2). This is the Fibonacci recurrence!"],
        "optimalApproach": ["Use two variables `a, b = 1, 1` and iterate n-1 times.", "Each step `a, b = b, a + b`."],
        "timeComplexity": "O(n) — single loop",
        "spaceComplexity": "O(1) — constant space variables",
        "testCases": [
            {"input": "n = 2", "expectedOutput": "2"},
            {"input": "n = 3", "expectedOutput": "3"}
        ],
        "hiddenTestCases": [
            {"input": "n = 1", "expectedOutput": "1", "isHidden": True},
            {"input": "n = 4", "expectedOutput": "5", "isHidden": True},
            {"input": "n = 5", "expectedOutput": "8", "isHidden": True},
            {"input": "n = 10", "expectedOutput": "89", "isHidden": True},
            {"input": "n = 20", "expectedOutput": "10946", "isHidden": True}
        ]
    },

    # 10. Longest Substring Without Repeating Characters
    {
        "id": "longest-substring-without-repeating-characters",
        "title": "Longest Substring Without Repeating Characters",
        "difficulty": "Medium",
        "category": "Algorithms & DSA",
        "topic": "Sliding Window",
        "companies": ["Amazon", "Google", "Microsoft", "Uber", "Flipkart"],
        "acceptanceRate": "34.5%",
        "description": "Given a string `s`, find the length of the longest substring without repeating characters.",
        "examples": [
            {"input": "s = \"abcabcbb\"", "output": "3", "explanation": "The answer is \"abc\", with the length of 3."},
            {"input": "s = \"bbbbb\"", "output": "1", "explanation": "The answer is \"b\", with the length of 1."},
            {"input": "s = \"pwwkew\"", "output": "3", "explanation": "The answer is \"wke\", with the length of 3."}
        ],
        "constraints": ["0 <= s.length <= 5 * 10^4", "s consists of English letters, digits, symbols and spaces."],
        "hints": ["Use a sliding window with left and right pointers and a hash map of character last seen indices.", "When you encounter a duplicate character, jump left pointer to `last_seen[char] + 1`."],
        "optimalApproach": ["Maintain window [left, right] and `seen = {}`.", "For each `s[right]`, if in seen and seen[char] >= left, update `left = seen[char] + 1`.", "Update `max_len = max(max_len, right - left + 1)`."],
        "timeComplexity": "O(n) — single traversal of string",
        "spaceComplexity": "O(min(m, n)) — hash map of unique characters",
        "testCases": [
            {"input": "s = \"abcabcbb\"", "expectedOutput": "3"},
            {"input": "s = \"bbbbb\"", "expectedOutput": "1"},
            {"input": "s = \"pwwkew\"", "expectedOutput": "3"}
        ],
        "hiddenTestCases": [
            {"input": "s = \"\"", "expectedOutput": "0", "isHidden": True},
            {"input": "s = \" \"", "expectedOutput": "1", "isHidden": True},
            {"input": "s = \"au\"", "expectedOutput": "2", "isHidden": True},
            {"input": "s = \"abba\"", "expectedOutput": "2", "isHidden": True},
            {"input": "s = \"tmmzuxt\"", "expectedOutput": "5", "isHidden": True}
        ]
    },

    # 11. Number of Islands
    {
        "id": "number-of-islands",
        "title": "Number of Islands",
        "difficulty": "Medium",
        "category": "Algorithms & DSA",
        "topic": "Graphs & BFS/DFS",
        "companies": ["Amazon", "Google", "Microsoft", "Bloomberg", "Salesforce"],
        "acceptanceRate": "58.2%",
        "description": "Given an `m x n` 2D binary grid `grid` which represents a map of '1's (land) and '0's (water), return the number of islands.\n\nAn island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically.",
        "examples": [
            {"input": "grid = [[\"1\",\"1\",\"1\",\"1\",\"0\"],[\"1\",\"1\",\"0\",\"1\",\"0\"],[\"1\",\"1\",\"0\",\"0\",\"0\"],[\"0\",\"0\",\"0\",\"0\",\"0\"]]", "output": "1"},
            {"input": "grid = [[\"1\",\"1\",\"0\",\"0\",\"0\"],[\"1\",\"1\",\"0\",\"0\",\"0\"],[\"0\",\"0\",\"1\",\"0\",\"0\"],[\"0\",\"0\",\"0\",\"1\",\"1\"]]", "output": "3"}
        ],
        "constraints": ["m == grid.length", "n == grid[i].length", "1 <= m, n <= 300", "grid[i][j] is '0' or '1'."],
        "hints": ["Traverse every cell in the grid. When you hit a '1', increment island count and trigger a BFS or DFS sink all connected '1's to '0'."],
        "optimalApproach": ["Sink connected land components using recursive DFS or Queue BFS."],
        "timeComplexity": "O(m * n) — visit each cell a constant number of times",
        "spaceComplexity": "O(m * n) — recursion call stack in worst case",
        "testCases": [
            {"input": "grid = [[\"1\",\"1\",\"0\"],[\"1\",\"1\",\"0\"],[\"0\",\"0\",\"1\"]]", "expectedOutput": "2"}
        ],
        "hiddenTestCases": [
            {"input": "grid = [[\"0\",\"0\"],[\"0\",\"0\"]]", "expectedOutput": "0", "isHidden": True},
            {"input": "grid = [[\"1\"]]", "expectedOutput": "1", "isHidden": True},
            {"input": "grid = [[\"1\",\"0\",\"1\"],[\"0\",\"1\",\"0\"],[\"1\",\"0\",\"1\"]]", "expectedOutput": "5", "isHidden": True}
        ]
    },

    # 12. Valid Palindrome
    {
        "id": "valid-palindrome",
        "title": "Valid Palindrome",
        "difficulty": "Easy",
        "category": "Algorithms & DSA",
        "topic": "Strings & Two Pointers",
        "companies": ["Facebook", "Microsoft", "Amazon", "Cognizant", "TCS"],
        "acceptanceRate": "46.2%",
        "description": "A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Alphanumeric characters include letters and numbers.\n\nGiven a string `s`, return `true` if it is a palindrome, or `false` otherwise.",
        "examples": [
            {"input": 's = "A man, a plan, a canal: Panama"', "output": "true", "explanation": '"amanaplanacanalpanama" is a palindrome.'},
            {"input": 's = "race a car"', "output": "false", "explanation": '"raceacar" is not a palindrome.'},
            {"input": 's = " "', "output": "true"}
        ],
        "constraints": ["1 <= s.length <= 2 * 10^5", "s consists only of printable ASCII characters."],
        "hints": ["Use two pointers moving from both ends towards the center, skipping non-alphanumeric characters."],
        "optimalApproach": [
            "Initialize left = 0, right = len(s) - 1.",
            "While left < right, skip non-alphanumeric chars.",
            "Compare s[left].lower() with s[right].lower(). Return false on mismatch, else step inward.",
            "Return true if pointers meet."
        ],
        "timeComplexity": "O(n)",
        "spaceComplexity": "O(1)",
        "testCases": [
            {"input": 's = "A man, a plan, a canal: Panama"', "expectedOutput": "true"},
            {"input": 's = "race a car"', "expectedOutput": "false"},
            {"input": 's = " "', "expectedOutput": "true"}
        ],
        "hiddenTestCases": [
            {"input": 's = "0P"', "expectedOutput": "false", "isHidden": True},
            {"input": 's = "ab_a"', "expectedOutput": "true", "isHidden": True},
            {"input": 's = ".,"', "expectedOutput": "true", "isHidden": True}
        ]
    },

    # 13. Search in Rotated Sorted Array
    {
        "id": "search-in-rotated-sorted-array",
        "title": "Search in Rotated Sorted Array",
        "difficulty": "Medium",
        "category": "Algorithms & DSA",
        "topic": "Binary Search",
        "companies": ["Google", "Amazon", "Microsoft", "Adobe", "Apple"],
        "acceptanceRate": "40.1%",
        "description": "There is an integer array `nums` sorted in ascending order (with distinct values) that has been possibly rotated at an unknown pivot index.\n\nGiven the array `nums` after the possible rotation and an integer `target`, return the index of `target` if it is in `nums`, or `-1` if it is not in `nums`.\n\nYou must write an algorithm with `O(log n)` runtime complexity.",
        "examples": [
            {"input": "nums = [4,5,6,7,0,1,2], target = 0", "output": "4"},
            {"input": "nums = [4,5,6,7,0,1,2], target = 3", "output": "-1"},
            {"input": "nums = [1], target = 0", "output": "-1"}
        ],
        "constraints": ["1 <= nums.length <= 5000", "-10^4 <= nums[i] <= 10^4", "All values of nums are unique."],
        "hints": ["In any rotated sorted array, at least one half [left, mid] or [mid, right] is guaranteed to be strictly sorted."],
        "optimalApproach": [
            "Calculate mid. If nums[left] <= nums[mid], the left half is sorted.",
            "Check if target is in [nums[left], nums[mid]]. If so, search left; else search right.",
            "Otherwise, the right half is sorted. Check if target is in [nums[mid], nums[right]]."
        ],
        "timeComplexity": "O(log n)",
        "spaceComplexity": "O(1)",
        "testCases": [
            {"input": "nums = [4,5,6,7,0,1,2], target = 0", "expectedOutput": "4"},
            {"input": "nums = [4,5,6,7,0,1,2], target = 3", "expectedOutput": "-1"},
            {"input": "nums = [1], target = 0", "expectedOutput": "-1"}
        ],
        "hiddenTestCases": [
            {"input": "nums = [1], target = 1", "expectedOutput": "0", "isHidden": True},
            {"input": "nums = [3,1], target = 1", "expectedOutput": "1", "isHidden": True},
            {"input": "nums = [5,1,3], target = 5", "expectedOutput": "0", "isHidden": True},
            {"input": "nums = [4,5,6,7,8,1,2,3], target = 8", "expectedOutput": "4", "isHidden": True}
        ]
    },

    # 14. Coin Change
    {
        "id": "coin-change",
        "title": "Coin Change",
        "difficulty": "Medium",
        "category": "Algorithms & DSA",
        "topic": "Dynamic Programming",
        "companies": ["Amazon", "Microsoft", "Google", "Goldman Sachs", "Infosys"],
        "acceptanceRate": "43.2%",
        "description": "You are given an integer array `coins` representing coins of different denominations and an integer `amount` representing a total amount of money.\n\nReturn the fewest number of coins that you need to make up that amount. If that amount of money cannot be made up by any combination of the coins, return `-1`.\n\nYou may assume that you have an infinite number of each kind of coin.",
        "examples": [
            {"input": "coins = [1,2,5], amount = 11", "output": "3", "explanation": "11 = 5 + 5 + 1"},
            {"input": "coins = [2], amount = 3", "output": "-1"},
            {"input": "coins = [1], amount = 0", "output": "0"}
        ],
        "constraints": ["1 <= coins.length <= 12", "1 <= coins[i] <= 2^31 - 1", "0 <= amount <= 10^4"],
        "hints": ["Use bottom-up DP where dp[i] is the minimum coins needed for amount i.", "dp[i] = min(dp[i], 1 + dp[i - coin]) for all coin <= i."],
        "optimalApproach": [
            "Initialize dp array of size amount + 1 filled with float('inf'), dp[0] = 0.",
            "For a from 1 to amount: for c in coins: if a - c >= 0: dp[a] = min(dp[a], 1 + dp[a - c]).",
            "Return dp[amount] if dp[amount] != inf else -1."
        ],
        "timeComplexity": "O(amount * len(coins))",
        "spaceComplexity": "O(amount)",
        "testCases": [
            {"input": "coins = [1,2,5], amount = 11", "expectedOutput": "3"},
            {"input": "coins = [2], amount = 3", "expectedOutput": "-1"},
            {"input": "coins = [1], amount = 0", "expectedOutput": "0"}
        ],
        "hiddenTestCases": [
            {"input": "coins = [1], amount = 1", "expectedOutput": "1", "isHidden": True},
            {"input": "coins = [1], amount = 2", "expectedOutput": "2", "isHidden": True},
            {"input": "coins = [2,5,10,1], amount = 27", "expectedOutput": "4", "isHidden": True},
            {"input": "coins = [186,419,83,408], amount = 6249", "expectedOutput": "20", "isHidden": True}
        ]
    },

    # 15. Merge Intervals
    {
        "id": "merge-intervals",
        "title": "Merge Intervals",
        "difficulty": "Medium",
        "category": "Algorithms & DSA",
        "topic": "Intervals & Sorting",
        "companies": ["Google", "Amazon", "Microsoft", "Bloomberg", "Salesforce"],
        "acceptanceRate": "47.1%",
        "description": "Given an array of `intervals` where `intervals[i] = [starti, endi]`, merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.",
        "examples": [
            {"input": "intervals = [[1,3],[2,6],[8,10],[15,18]]", "output": "[[1,6],[8,10],[15,18]]"},
            {"input": "intervals = [[1,4],[4,5]]", "output": "[[1,5]]"}
        ],
        "constraints": ["1 <= intervals.length <= 10^4", "intervals[i].length == 2", "0 <= starti <= endi <= 10^4"],
        "hints": ["Sort intervals by start time first. Then compare current start with previous end."],
        "optimalApproach": [
            "Sort intervals by interval[0].",
            "Iterate: if merged is empty or merged[-1][1] < interval[0], append interval.",
            "Otherwise, overlap exists -> merged[-1][1] = max(merged[-1][1], interval[1])."
        ],
        "timeComplexity": "O(n log n)",
        "spaceComplexity": "O(n)",
        "testCases": [
            {"input": "intervals = [[1,3],[2,6],[8,10],[15,18]]", "expectedOutput": "[[1,6],[8,10],[15,18]]"},
            {"input": "intervals = [[1,4],[4,5]]", "expectedOutput": "[[1,5]]"}
        ],
        "hiddenTestCases": [
            {"input": "intervals = [[1,4],[0,4]]", "expectedOutput": "[[0,4]]", "isHidden": True},
            {"input": "intervals = [[1,4],[2,3]]", "expectedOutput": "[[1,4]]", "isHidden": True},
            {"input": "intervals = [[1,4],[5,6]]", "expectedOutput": "[[1,4],[5,6]]", "isHidden": True}
        ]
    },

    # 16. Course Schedule
    {
        "id": "course-schedule",
        "title": "Course Schedule",
        "difficulty": "Medium",
        "category": "Algorithms & DSA",
        "topic": "Graphs & Topological Sort",
        "companies": ["Amazon", "Google", "Microsoft", "TCS", "Zoho"],
        "acceptanceRate": "46.8%",
        "description": "There are a total of `numCourses` courses you have to take, labeled from `0` to `numCourses - 1`. You are given an array `prerequisites` where `prerequisites[i] = [ai, bi]` indicates that you must take course `bi` first if you want to take course `ai`.\n\nReturn `true` if you can finish all courses. Otherwise, return `false` (i.e. check for cycles in directed graph).",
        "examples": [
            {"input": "numCourses = 2, prerequisites = [[1,0]]", "output": "true"},
            {"input": "numCourses = 2, prerequisites = [[1,0],[0,1]]", "output": "false"}
        ],
        "constraints": ["1 <= numCourses <= 2000", "0 <= prerequisites.length <= 5000"],
        "hints": ["Model courses as a directed graph. A valid order exists if and only if the graph has no directed cycle (Topological Sort / Kahn's algorithm)."],
        "optimalApproach": [
            "Build adjacency list and compute in-degree of all nodes.",
            "Enqueue all nodes with in-degree 0.",
            "Process queue: for each neighbor, decrement in-degree; enqueue if in-degree becomes 0.",
            "Return true if total visited courses == numCourses."
        ],
        "timeComplexity": "O(V + E)",
        "spaceComplexity": "O(V + E)",
        "testCases": [
            {"input": "numCourses = 2, prerequisites = [[1,0]]", "expectedOutput": "true"},
            {"input": "numCourses = 2, prerequisites = [[1,0],[0,1]]", "expectedOutput": "false"}
        ],
        "hiddenTestCases": [
            {"input": "numCourses = 3, prerequisites = [[0,1],[0,2],[1,2]]", "expectedOutput": "true", "isHidden": True},
            {"input": "numCourses = 1, prerequisites = []", "expectedOutput": "true", "isHidden": True},
            {"input": "numCourses = 4, prerequisites = [[2,0],[1,0],[3,1],[3,2],[1,3]]", "expectedOutput": "false", "isHidden": True}
        ]
    },

    # 17. Lowest Common Ancestor of a BST
    {
        "id": "lowest-common-ancestor-of-a-binary-search-tree",
        "title": "Lowest Common Ancestor of a BST",
        "difficulty": "Medium",
        "category": "Algorithms & DSA",
        "topic": "Trees & BST",
        "companies": ["Amazon", "Microsoft", "Google", "Facebook", "Infosys"],
        "acceptanceRate": "62.4%",
        "description": "Given a binary search tree (BST), find the lowest common ancestor (LCA) node of two given nodes in the BST.\n\nAccording to the definition of LCA on Wikipedia: The lowest common ancestor is defined between two nodes p and q as the lowest node in T that has both p and q as descendants (where we allow a node to be a descendant of itself).",
        "examples": [
            {"input": "root = [6,2,8,0,4,7,9,null,null,3,5], p = 2, q = 8", "output": "6"},
            {"input": "root = [6,2,8,0,4,7,9,null,null,3,5], p = 2, q = 4", "output": "2"}
        ],
        "constraints": ["The number of nodes in the tree is in the range [2, 10^5].", "All Node.val are unique.", "p and q will exist in the BST."],
        "hints": ["Leverage the BST property: left < root < right.", "If both p and q are smaller than root, LCA is in left subtree. If both are greater, LCA is in right subtree. Otherwise, current root is the split point (LCA)."],
        "optimalApproach": [
            "Start at root.",
            "If p.val < curr.val and q.val < curr.val, curr = curr.left.",
            "Else if p.val > curr.val and q.val > curr.val, curr = curr.right.",
            "Else return curr (or curr.val)."
        ],
        "timeComplexity": "O(h) where h is height of BST.",
        "spaceComplexity": "O(1) iterative.",
        "testCases": [
            {"input": "root = [6,2,8,0,4,7,9,null,null,3,5], p = 2, q = 8", "expectedOutput": "6"},
            {"input": "root = [6,2,8,0,4,7,9,null,null,3,5], p = 2, q = 4", "expectedOutput": "2"}
        ],
        "hiddenTestCases": [
            {"input": "root = [2,1], p = 2, q = 1", "expectedOutput": "2", "isHidden": True},
            {"input": "root = [5,3,6,2,4,null,null,1], p = 1, q = 4", "expectedOutput": "3", "isHidden": True}
        ]
    },

    # 18. Kth Largest Element in an Array
    {
        "id": "kth-largest-element-in-an-array",
        "title": "Kth Largest Element in an Array",
        "difficulty": "Medium",
        "category": "Algorithms & DSA",
        "topic": "Heaps & Priority Queue",
        "companies": ["Amazon", "Facebook", "Microsoft", "Google", "TCS"],
        "acceptanceRate": "66.5%",
        "description": "Given an integer array `nums` and an integer `k`, return the `k`th largest element in the array.\n\nNote that it is the `k`th largest element in the sorted order, not the `k`th distinct element.\n\nCan you solve it without sorting in O(n log k) time using a Min-Heap?",
        "examples": [
            {"input": "nums = [3,2,1,5,6,4], k = 2", "output": "5"},
            {"input": "nums = [3,2,3,1,2,4,5,5,6], k = 4", "output": "4"}
        ],
        "constraints": ["1 <= k <= nums.length <= 10^5", "-10^4 <= nums[i] <= 10^4"],
        "hints": ["Use a min-heap of capacity k. Push numbers and pop smallest whenever heap size exceeds k. The root will be the kth largest."],
        "optimalApproach": [
            "Maintain a min-heap of size k using heapq.",
            "Iterate through nums: push num; if len(heap) > k: heappop(heap).",
            "Return heap[0]."
        ],
        "timeComplexity": "O(n log k)",
        "spaceComplexity": "O(k)",
        "testCases": [
            {"input": "nums = [3,2,1,5,6,4], k = 2", "expectedOutput": "5"},
            {"input": "nums = [3,2,3,1,2,4,5,5,6], k = 4", "expectedOutput": "4"}
        ],
        "hiddenTestCases": [
            {"input": "nums = [1], k = 1", "expectedOutput": "1", "isHidden": True},
            {"input": "nums = [-1,-1], k = 2", "expectedOutput": "-1", "isHidden": True},
            {"input": "nums = [7,6,5,4,3,2,1], k = 5", "expectedOutput": "3", "isHidden": True}
        ]
    },

    # 19. Combine Two Tables (SQL)
    {
        "id": "combine-two-tables",
        "title": "Combine Two Tables",
        "difficulty": "Easy",
        "category": "Database & SQL",
        "topic": "SQL Joins",
        "companies": ["Amazon", "TCS", "Infosys", "Accenture", "Cognizant"],
        "acceptanceRate": "75.2%",
        "description": "Write a SQL query to report the first name, last name, city, and state of each person in the `Person` table. If the address of a personId is not present in the `Address` table, report null instead.",
        "examples": [
            {"input": "Person = [[1, 'Wang', 'Allen'], [2, 'Alice', 'Bob']], Address = [[1, 2, 'New York City', 'New York']]", "output": "[['Allen', 'Wang', null, null], ['Bob', 'Alice', 'New York City', 'New York']]"}
        ],
        "constraints": ["Person and Address table schema."],
        "hints": ["Use a LEFT JOIN between Person and Address on personId."],
        "optimalApproach": ["SELECT p.firstName, p.lastName, a.city, a.state FROM Person p LEFT JOIN Address a ON p.personId = a.personId;"],
        "timeComplexity": "O(n + m)",
        "spaceComplexity": "O(1)",
        "testCases": [
            {"input": "Person table with 2 rows, Address with 1 row", "expectedOutput": "[['Allen', 'Wang', null, null], ['Bob', 'Alice', 'New York City', 'New York']]"}
        ],
        "hiddenTestCases": [
            {"input": "Person table with no address matches", "expectedOutput": "All null addresses", "isHidden": True}
        ]
    },

    # 20. Second Highest Salary (SQL)
    {
        "id": "second-highest-salary",
        "title": "Second Highest Salary",
        "difficulty": "Medium",
        "category": "Database & SQL",
        "topic": "SQL Aggregation & Subqueries",
        "companies": ["Amazon", "Google", "Microsoft", "TCS", "Infosys"],
        "acceptanceRate": "38.7%",
        "description": "Write a SQL query to report the second highest distinct salary from the `Employee` table. If there is no second highest salary, the query should report `null`.",
        "examples": [
            {"input": "Employee = [[1, 100], [2, 200], [3, 300]]", "output": "200"},
            {"input": "Employee = [[1, 100]]", "output": "null"}
        ],
        "constraints": ["Employee table with id (primary key) and salary."],
        "hints": ["Use DISTINCT salary ordered in DESC with LIMIT 1 OFFSET 1, or MAX(salary) WHERE salary < (SELECT MAX(salary))."],
        "optimalApproach": ["SELECT MAX(salary) AS SecondHighestSalary FROM Employee WHERE salary < (SELECT MAX(salary) FROM Employee);"],
        "timeComplexity": "O(n)",
        "spaceComplexity": "O(1)",
        "testCases": [
            {"input": "Employee table with salaries 100, 200, 300", "expectedOutput": "200"}
        ],
        "hiddenTestCases": [
            {"input": "Employee table with single salary 100", "expectedOutput": "null", "isHidden": True}
        ]
    },

    # 21. Duplicate Emails (SQL)
    {
        "id": "duplicate-emails",
        "title": "Duplicate Emails",
        "difficulty": "Easy",
        "category": "Database & SQL",
        "topic": "SQL Group By & Having",
        "companies": ["Amazon", "TCS", "Cognizant", "Infosys", "Wipro"],
        "acceptanceRate": "71.4%",
        "description": "Write a SQL query to report all duplicate emails in a table named `Person`.\n\nReturn the result table in any order.",
        "examples": [
            {"input": "Person = [[1, 'a@b.com'], [2, 'c@d.com'], [3, 'a@b.com']]", "output": "['a@b.com']"}
        ],
        "constraints": ["id is primary key column for this table. Each row contains an email."],
        "hints": ["Use GROUP BY email and filter with HAVING COUNT(email) > 1."],
        "optimalApproach": ["SELECT email FROM Person GROUP BY email HAVING COUNT(email) > 1;"],
        "timeComplexity": "O(n)",
        "spaceComplexity": "O(n)",
        "testCases": [
            {"input": "Person with emails a@b.com, c@d.com, a@b.com", "expectedOutput": "['a@b.com']"}
        ],
        "hiddenTestCases": [
            {"input": "Person with all unique emails", "expectedOutput": "Empty result", "isHidden": True}
        ]
    },

    # 22. Customers Who Never Order (SQL)
    {
        "id": "customers-who-never-order",
        "title": "Customers Who Never Order",
        "difficulty": "Easy",
        "category": "Database & SQL",
        "topic": "SQL Joins & Subqueries",
        "companies": ["Amazon", "Accenture", "TCS", "Infosys"],
        "acceptanceRate": "68.9%",
        "description": "Write a SQL query to report all customers who never order anything.\n\nReturn the result table in any order.",
        "examples": [
            {"input": "Customers = [[1, 'Joe'], [2, 'Henry'], [3, 'Sam'], [4, 'Max']], Orders = [[1, 3], [2, 1]]", "output": "['Henry', 'Max']"}
        ],
        "constraints": ["Customers (id, name), Orders (id, customerId)."],
        "hints": ["Use a LEFT JOIN between Customers and Orders and filter WHERE Orders.customerId IS NULL, or WHERE id NOT IN (SELECT customerId FROM Orders)."],
        "optimalApproach": ["SELECT name AS Customers FROM Customers c LEFT JOIN Orders o ON c.id = o.customerId WHERE o.customerId IS NULL;"],
        "timeComplexity": "O(n + m)",
        "spaceComplexity": "O(1)",
        "testCases": [
            {"input": "Customers Joe, Henry, Sam, Max with orders for Sam and Joe", "expectedOutput": "['Henry', 'Max']"}
        ],
        "hiddenTestCases": [
            {"input": "All customers ordered something", "expectedOutput": "Empty result", "isHidden": True}
        ]
    }
]


async def get_all_problems(user_id: Optional[str] = None) -> List[Dict[str, Any]]:
    """
    Returns sanitized problem catalog (hiddenTestCases omitted)
    with real solved/attempted status from MongoDB for the user.
    """
    user_status_map = {}
    if user_id:
        records = await user_problems_collection.find({"user_id": user_id}, {"_id": 0}).to_list(1000)
        for r in records:
            user_status_map[r["problem_id"]] = r

    result = []
    for p in PROBLEMS_DATA:
        p_copy = {k: v for k, v in p.items() if k != "hiddenTestCases"}
        
        # Overlay user-specific progress
        user_prog = user_status_map.get(p["id"])
        if user_prog:
            p_copy["status"] = user_prog.get("status", "Not Started")
            p_copy["attemptsCount"] = user_prog.get("attempts_count", 0)
            p_copy["bestRuntime"] = user_prog.get("best_runtime")
            p_copy["bookmarked"] = user_prog.get("bookmarked", False)
        else:
            p_copy["status"] = "Not Started"
            p_copy["attemptsCount"] = 0
            p_copy["bestRuntime"] = None
            p_copy["bookmarked"] = False

        result.append(p_copy)

    return result


async def get_problem_by_id(problem_id: str, user_id: Optional[str] = None) -> Optional[Dict[str, Any]]:
    """
    Returns a single sanitized problem (without hidden test cases).
    """
    target = next((p for p in PROBLEMS_DATA if p["id"] == problem_id), None)
    if not target:
        return None

    p_copy = {k: v for k, v in target.items() if k != "hiddenTestCases"}
    if user_id:
        user_prog = await user_problems_collection.find_one({"user_id": user_id, "problem_id": problem_id}, {"_id": 0})
        if user_prog:
            p_copy["status"] = user_prog.get("status", "Not Started")
            p_copy["attemptsCount"] = user_prog.get("attempts_count", 0)
            p_copy["bestRuntime"] = user_prog.get("best_runtime")
            p_copy["bookmarked"] = user_prog.get("bookmarked", False)
        else:
            p_copy["status"] = "Not Started"

    return p_copy


def get_problem_test_cases(problem_id: str, include_hidden: bool = False) -> List[Dict[str, Any]]:
    """
    Internal Judge function: retrieves test cases.
    Hidden test cases are included ONLY when include_hidden=True for backend execution.
    """
    target = next((p for p in PROBLEMS_DATA if p["id"] == problem_id), None)
    if not target:
        return []

    cases = list(target.get("testCases", []))
    if include_hidden:
        cases.extend(target.get("hiddenTestCases", []))

    return cases


async def get_user_submissions(user_id: str, problem_id: Optional[str] = None) -> List[Dict[str, Any]]:
    """
    Fetches real submissions for a user from MongoDB.
    """
    query: Dict[str, Any] = {"user_id": user_id}
    if problem_id:
        query["problem_id"] = problem_id

    subs = await coding_submissions_collection.find(query, {"_id": 0}).sort("timestamp", -1).to_list(100)
    for s in subs:
        if isinstance(s.get("timestamp"), str):
            try:
                s["timestamp"] = datetime.fromisoformat(s["timestamp"])
            except Exception:
                pass
    return subs


async def record_user_submission(
    user_id: str,
    problem_id: str,
    language: str,
    code: str,
    status: str,
    runtime: int,
    memory: float,
    passed_count: int,
    total_count: int,
    visible_passed: int,
    visible_total: int,
    hidden_passed: int,
    hidden_total: int,
    test_case_results: List[Dict[str, Any]],
    error_message: Optional[str] = None,
    console_output: Optional[str] = None,
) -> Dict[str, Any]:
    """
    Records a real submission to MongoDB and updates the user's problem mastery state.
    """
    sub_doc = {
        "id": str(uuid.uuid4()),
        "submission_id": str(uuid.uuid4()),
        "user_id": user_id,
        "problem_id": problem_id,
        "language": language,
        "code": code,
        "status": status,
        "runtime": runtime,
        "memory": memory,
        "passed_count": passed_count,
        "total_count": total_count,
        "visible_passed": visible_passed,
        "visible_total": visible_total,
        "hidden_passed": hidden_passed,
        "hidden_total": hidden_total,
        "test_case_results": test_case_results,
        "error_message": error_message,
        "console_output": console_output,
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }

    await coding_submissions_collection.insert_one(sub_doc)

    # Update user problem status in user_problems_collection
    is_accepted = (status == "Accepted")
    existing_problem = await user_problems_collection.find_one({"user_id": user_id, "problem_id": problem_id})

    now_iso = datetime.now(timezone.utc).isoformat()
    if existing_problem:
        new_status = "Solved" if is_accepted or existing_problem.get("status") == "Solved" else "Attempted"
        best_rt = existing_problem.get("best_runtime")
        if is_accepted and (best_rt is None or runtime < best_rt):
            best_rt = runtime

        await user_problems_collection.update_one(
            {"user_id": user_id, "problem_id": problem_id},
            {
                "$set": {
                    "status": new_status,
                    "last_language": language,
                    "best_runtime": best_rt,
                    "updated_at": now_iso,
                    **({"solved_at": now_iso} if is_accepted and not existing_problem.get("solved_at") else {}),
                },
                "$inc": {"attempts_count": 1},
            }
        )
    else:
        new_status = "Solved" if is_accepted else "Attempted"
        await user_problems_collection.insert_one({
            "id": str(uuid.uuid4()),
            "user_id": user_id,
            "problem_id": problem_id,
            "status": new_status,
            "attempts_count": 1,
            "solved_at": now_iso if is_accepted else None,
            "best_runtime": runtime if is_accepted else None,
            "bookmarked": False,
            "last_language": language,
            "updated_at": now_iso,
        })

    sub_doc.pop("_id", None)
    return sub_doc
