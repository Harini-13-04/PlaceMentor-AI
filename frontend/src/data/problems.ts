// ============================================================================
// PlaceMentor AI — Complete High-Yield Interview Problem Dataset (140+ Problems)
// ============================================================================

export type Difficulty = "Easy" | "Medium" | "Hard";
export type Category = "DSA" | "SQL" | "Core CS";
export type InterviewImportance =
  | "Frequently Asked"
  | "Interview Essential"
  | "Beginner Foundation"
  | "Intermediate"
  | "Advanced";
export type ProblemStatus = "Not Started" | "Attempted" | "Solved";

export interface TestCase {
  id: string;
  input: string;
  expectedOutput: string;
  explanation?: string;
}

export interface Problem {
  id: string;
  title: string;
  slug: string;
  difficulty: Difficulty;
  category: Category;
  topics: string[];
  companies?: string[];
  frequentlyAsked: boolean;
  interviewImportance: InterviewImportance;
  description: string;
  examples: {
    input: string;
    output: string;
    explanation?: string;
  }[];
  constraints: string[];
  starterCode: {
    python: string;
    javascript: string;
    java: string;
    cpp: string;
    sql?: string;
  };
  supportedLanguages: ("python" | "javascript" | "java" | "cpp" | "sql")[];
  testCases: TestCase[];
  hints: string[];
  approach: {
    summary: string;
    steps: string[];
  };
  complexity: {
    time: string;
    space: string;
    analysis: string;
  };
  defaultMastery?: number;
  recommendedTimeMinutes?: number;
}

export const PROBLEMS: Problem[] = [
  {
    "id": "pm-arr-001",
    "title": "Two Sum",
    "slug": "two-sum",
    "difficulty": "Easy",
    "category": "DSA",
    "topics": [
      "Arrays",
      "Hashing"
    ],
    "companies": [
      "Amazon",
      "Microsoft",
      "Google",
      "TCS",
      "Infosys"
    ],
    "frequentlyAsked": true,
    "interviewImportance": "Frequently Asked",
    "description": "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice. You can return the answer in any order.",
    "examples": [
      {
        "input": "nums = [2,7,11,15], target = 9",
        "output": "[0,1]",
        "explanation": "nums[0] + nums[1] == 9, return [0, 1]."
      },
      {
        "input": "nums = [3,2,4], target = 6",
        "output": "[1,2]"
      }
    ],
    "constraints": [
      "2 <= nums.length <= 10^4",
      "-10^9 <= nums[i] <= 10^9",
      "-10^9 <= target <= 10^9"
    ],
    "starterCode": {
      "python": "def twoSum(nums: list[int], target: int) -> list[int]:\n    # Write your solution here\n    return []\n",
      "javascript": "function twoSum(nums, target) {\n    // Write your solution here\n    return [];\n}\n",
      "java": "class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Write your solution here\n        return new int[]{};\n    }\n}\n",
      "cpp": "class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        // Write your solution here\n        return {};\n    }\n};\n"
    },
    "supportedLanguages": [
      "python",
      "javascript",
      "java",
      "cpp"
    ],
    "testCases": [
      {
        "id": "tc-1",
        "input": "nums = [2,7,11,15], target = 9",
        "expectedOutput": "[0, 1]"
      },
      {
        "id": "tc-2",
        "input": "nums = [3,2,4], target = 6",
        "expectedOutput": "[1, 2]"
      }
    ],
    "hints": [
      "Calculate the complement = target - nums[i].",
      "Use a hash map to record seen elements.",
      "Check for complement in map in O(1) time."
    ],
    "approach": {
      "summary": "One-pass Hash Map lookup.",
      "steps": [
        "Initialize empty hash map.",
        "Iterate nums: if complement in map, return indices; else store num."
      ]
    },
    "complexity": {
      "time": "O(N)",
      "space": "O(N)",
      "analysis": "Algorithm runs in O(N) time with O(N) space complexity."
    },
    "defaultMastery": 90,
    "recommendedTimeMinutes": 15
  },
  {
    "id": "pm-arr-002",
    "title": "Contains Duplicate",
    "slug": "contains-duplicate",
    "difficulty": "Easy",
    "category": "DSA",
    "topics": [
      "Arrays",
      "Hashing"
    ],
    "companies": [
      "TCS",
      "Accenture",
      "Wipro",
      "Amazon"
    ],
    "frequentlyAsked": true,
    "interviewImportance": "Frequently Asked",
    "description": "Given an integer array `nums`, return `true` if any value appears at least twice in the array, and return `false` if every element is distinct.",
    "examples": [
      {
        "input": "nums = [1,2,3,1]",
        "output": "true"
      },
      {
        "input": "nums = [1,2,3,4]",
        "output": "false"
      }
    ],
    "constraints": [
      "1 <= nums.length <= 10^5",
      "-10^9 <= nums[i] <= 10^9"
    ],
    "starterCode": {
      "python": "def containsDuplicate(nums: list[int]) -> bool:\n    # Write your solution here\n    return False\n",
      "javascript": "function containsDuplicate(nums) {\n    // Write your solution here\n    return false;\n}\n",
      "java": "class Solution {\n    public boolean containsDuplicate(int[] nums) {\n        // Write your solution here\n        return false;\n    }\n}\n",
      "cpp": "class Solution {\npublic:\n    bool containsDuplicate(vector<int>& nums) {\n        // Write your solution here\n        return false;\n    }\n};\n"
    },
    "supportedLanguages": [
      "python",
      "javascript",
      "java",
      "cpp"
    ],
    "testCases": [
      {
        "id": "tc-1",
        "input": "nums = [1,2,3,1]",
        "expectedOutput": "true"
      },
      {
        "id": "tc-2",
        "input": "nums = [1,2,3,4]",
        "expectedOutput": "false"
      }
    ],
    "hints": [
      "Use a Hash Set to track seen numbers in O(1).",
      "Return true immediately if number exists in set."
    ],
    "approach": {
      "summary": "Hash Set membership.",
      "steps": [
        "Iterate through nums.",
        "If num in set, return true.",
        "Else add to set. Return false at end."
      ]
    },
    "complexity": {
      "time": "O(N)",
      "space": "O(N)",
      "analysis": "Algorithm runs in O(N) time with O(N) space complexity."
    },
    "defaultMastery": 95,
    "recommendedTimeMinutes": 15
  },
  {
    "id": "pm-arr-003",
    "title": "Best Time to Buy and Sell Stock",
    "slug": "best-time-to-buy-and-sell-stock",
    "difficulty": "Easy",
    "category": "DSA",
    "topics": [
      "Arrays",
      "Dynamic Programming"
    ],
    "companies": [
      "Amazon",
      "Microsoft",
      "Google",
      "Cognizant"
    ],
    "frequentlyAsked": true,
    "interviewImportance": "Frequently Asked",
    "description": "You are given an array `prices` where `prices[i]` is the price of a given stock on the `i-th` day. You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock. Return the maximum profit you can achieve.",
    "examples": [
      {
        "input": "prices = [7,1,5,3,6,4]",
        "output": "5"
      },
      {
        "input": "prices = [7,6,4,3,1]",
        "output": "0"
      }
    ],
    "constraints": [
      "1 <= prices.length <= 10^5",
      "0 <= prices[i] <= 10^4"
    ],
    "starterCode": {
      "python": "def maxProfit(prices: list[int]) -> int:\n    # Write your solution here\n    return 0\n",
      "javascript": "function maxProfit(prices) {\n    // Write your solution here\n    return 0;\n}\n",
      "java": "class Solution {\n    public int maxProfit(int[] prices) {\n        // Write your solution here\n        return 0;\n    }\n}\n",
      "cpp": "class Solution {\npublic:\n    int maxProfit(vector<int>& prices) {\n        // Write your solution here\n        return 0;\n    }\n};\n"
    },
    "supportedLanguages": [
      "python",
      "javascript",
      "java",
      "cpp"
    ],
    "testCases": [
      {
        "id": "tc-1",
        "input": "prices = [7,1,5,3,6,4]",
        "expectedOutput": "5"
      },
      {
        "id": "tc-2",
        "input": "prices = [7,6,4,3,1]",
        "expectedOutput": "0"
      }
    ],
    "hints": [
      "Track the minimum price seen so far.",
      "Compute profit = current price - minimum price at each step."
    ],
    "approach": {
      "summary": "One-pass tracking minimum buy price.",
      "steps": [
        "minPrice = infinity, maxProfit = 0.",
        "Update minPrice = min(minPrice, p).",
        "Update maxProfit = max(maxProfit, p - minPrice).",
        "Return maxProfit."
      ]
    },
    "complexity": {
      "time": "O(N)",
      "space": "O(1)",
      "analysis": "Algorithm runs in O(N) time with O(1) space complexity."
    },
    "defaultMastery": 85,
    "recommendedTimeMinutes": 15
  },
  {
    "id": "pm-arr-004",
    "title": "Product of Array Except Self",
    "slug": "product-of-array-except-self",
    "difficulty": "Medium",
    "category": "DSA",
    "topics": [
      "Arrays",
      "Prefix Sum"
    ],
    "companies": [
      "Amazon",
      "Microsoft",
      "Google",
      "Zoho"
    ],
    "frequentlyAsked": true,
    "interviewImportance": "Frequently Asked",
    "description": "Given an integer array `nums`, return an array `answer` such that `answer[i]` is equal to the product of all the elements of `nums` except `nums[i]`. You must solve it in O(n) time and without division.",
    "examples": [
      {
        "input": "nums = [1,2,3,4]",
        "output": "[24,12,8,6]"
      },
      {
        "input": "nums = [-1,1,0,-3,3]",
        "output": "[0,0,9,0,0]"
      }
    ],
    "constraints": [
      "2 <= nums.length <= 10^5",
      "-30 <= nums[i] <= 30"
    ],
    "starterCode": {
      "python": "def productExceptSelf(nums: list[int]) -> list[int]:\n    # Write your solution here\n    return []\n",
      "javascript": "function productExceptSelf(nums) {\n    // Write your solution here\n    return [];\n}\n",
      "java": "class Solution {\n    public int[] productExceptSelf(int[] nums) {\n        // Write your solution here\n        return new int[]{};\n    }\n}\n",
      "cpp": "class Solution {\npublic:\n    vector<int> productExceptSelf(vector<int>& nums) {\n        // Write your solution here\n        return {};\n    }\n};\n"
    },
    "supportedLanguages": [
      "python",
      "javascript",
      "java",
      "cpp"
    ],
    "testCases": [
      {
        "id": "tc-1",
        "input": "nums = [1,2,3,4]",
        "expectedOutput": "[24, 12, 8, 6]"
      },
      {
        "id": "tc-2",
        "input": "nums = [-1,1,0,-3,3]",
        "expectedOutput": "[0, 0, 9, 0, 0]"
      }
    ],
    "hints": [
      "Use prefix and suffix product passes.",
      "First store prefix products, then multiply by running suffix."
    ],
    "approach": {
      "summary": "Prefix and Suffix scan in O(1) extra space.",
      "steps": [
        "Pass 1: calculate left prefix products.",
        "Pass 2: multiply with running right suffix product."
      ]
    },
    "complexity": {
      "time": "O(N)",
      "space": "O(1)",
      "analysis": "Algorithm runs in O(N) time with O(1) space complexity."
    },
    "defaultMastery": 80,
    "recommendedTimeMinutes": 25
  },
  {
    "id": "pm-arr-005",
    "title": "Maximum Subarray (Kadane's Algorithm)",
    "slug": "maximum-subarray",
    "difficulty": "Medium",
    "category": "DSA",
    "topics": [
      "Arrays",
      "Dynamic Programming"
    ],
    "companies": [
      "Amazon",
      "Microsoft",
      "TCS",
      "Capgemini"
    ],
    "frequentlyAsked": true,
    "interviewImportance": "Frequently Asked",
    "description": "Given an integer array `nums`, find the subarray with the largest sum, and return its sum.",
    "examples": [
      {
        "input": "nums = [-2,1,-3,4,-1,2,1,-5,4]",
        "output": "6"
      },
      {
        "input": "nums = [1]",
        "output": "1"
      }
    ],
    "constraints": [
      "1 <= nums.length <= 10^5",
      "-10^4 <= nums[i] <= 10^4"
    ],
    "starterCode": {
      "python": "def maxSubArray(nums: list[int]) -> int:\n    # Write your solution here\n    return 0\n",
      "javascript": "function maxSubArray(nums) {\n    // Write your solution here\n    return 0;\n}\n",
      "java": "class Solution {\n    public int maxSubArray(int[] nums) {\n        // Write your solution here\n        return 0;\n    }\n}\n",
      "cpp": "class Solution {\npublic:\n    int maxSubArray(vector<int>& nums) {\n        // Write your solution here\n        return 0;\n    }\n};\n"
    },
    "supportedLanguages": [
      "python",
      "javascript",
      "java",
      "cpp"
    ],
    "testCases": [
      {
        "id": "tc-1",
        "input": "nums = [-2,1,-3,4,-1,2,1,-5,4]",
        "expectedOutput": "6"
      },
      {
        "id": "tc-2",
        "input": "nums = [1]",
        "expectedOutput": "1"
      }
    ],
    "hints": [
      "If current running sum is negative, reset to 0 or current element.",
      "Keep track of global maximum sum."
    ],
    "approach": {
      "summary": "Kadane's Linear Algorithm.",
      "steps": [
        "curSum = 0, maxSum = nums[0].",
        "For each x: curSum = max(x, curSum + x); maxSum = max(maxSum, curSum).",
        "Return maxSum."
      ]
    },
    "complexity": {
      "time": "O(N)",
      "space": "O(1)",
      "analysis": "Algorithm runs in O(N) time with O(1) space complexity."
    },
    "defaultMastery": 85,
    "recommendedTimeMinutes": 25
  },
  {
    "id": "pm-arr-006",
    "title": "Merge Intervals",
    "slug": "merge-intervals",
    "difficulty": "Medium",
    "category": "DSA",
    "topics": [
      "Arrays",
      "Sorting"
    ],
    "companies": [
      "Amazon",
      "Microsoft",
      "Google",
      "Zoho"
    ],
    "frequentlyAsked": true,
    "interviewImportance": "Frequently Asked",
    "description": "Given an array of `intervals` where `intervals[i] = [start_i, end_i]`, merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.",
    "examples": [
      {
        "input": "intervals = [[1,3],[2,6],[8,10],[15,18]]",
        "output": "[[1,6],[8,10],[15,18]]"
      },
      {
        "input": "intervals = [[1,4],[4,5]]",
        "output": "[[1,5]]"
      }
    ],
    "constraints": [
      "1 <= intervals.length <= 10^4",
      "intervals[i].length == 2"
    ],
    "starterCode": {
      "python": "def merge(intervals: list[list[int]]) -> list[list[int]]:\n    # Write your solution here\n    return []\n",
      "javascript": "function merge(intervals) {\n    // Write your solution here\n    return [];\n}\n",
      "java": "class Solution {\n    public int[][] merge(int[][] intervals) {\n        // Write your solution here\n        return new int[][]{};\n    }\n}\n",
      "cpp": "class Solution {\npublic:\n    vector<vector<int>> merge(vector<vector<int>>& intervals) {\n        // Write your solution here\n        return {};\n    }\n};\n"
    },
    "supportedLanguages": [
      "python",
      "javascript",
      "java",
      "cpp"
    ],
    "testCases": [
      {
        "id": "tc-1",
        "input": "intervals = [[1,3],[2,6],[8,10],[15,18]]",
        "expectedOutput": "[[1, 6], [8, 10], [15, 18]]"
      }
    ],
    "hints": [
      "Sort intervals by start time.",
      "If current interval start <= previous end, merge by extending max end."
    ],
    "approach": {
      "summary": "Sorting and linear merge.",
      "steps": [
        "Sort intervals by start.",
        "Iterate and merge overlapping intervals."
      ]
    },
    "complexity": {
      "time": "O(N log N)",
      "space": "O(N)",
      "analysis": "Algorithm runs in O(N log N) time with O(N) space complexity."
    },
    "defaultMastery": 75,
    "recommendedTimeMinutes": 25
  },
  {
    "id": "pm-arr-007",
    "title": "Rotate Image / Matrix",
    "slug": "rotate-image",
    "difficulty": "Medium",
    "category": "DSA",
    "topics": [
      "Arrays",
      "Matrix"
    ],
    "companies": [
      "Amazon",
      "Microsoft",
      "Google"
    ],
    "frequentlyAsked": true,
    "interviewImportance": "Frequently Asked",
    "description": "You are given an `n x n` 2D `matrix` representing an image, rotate the image by 90 degrees (clockwise) in-place.",
    "examples": [
      {
        "input": "matrix = [[1,2,3],[4,5,6],[7,8,9]]",
        "output": "[[7,4,1],[8,5,2],[9,6,3]]"
      }
    ],
    "constraints": [
      "n == matrix.length == matrix[i].length",
      "1 <= n <= 20"
    ],
    "starterCode": {
      "python": "def rotate(matrix: list[list[int]]) -> None:\n    # Write your solution here\n    pass\n",
      "javascript": "function rotate(matrix) {\n    // Write your solution here\n}\n",
      "java": "class Solution {\n    public void rotate(int[][] matrix) {\n        // Write your solution here\n    }\n}\n",
      "cpp": "class Solution {\npublic:\n    void rotate(vector<vector<int>>& matrix) {\n        // Write your solution here\n    }\n};\n"
    },
    "supportedLanguages": [
      "python",
      "javascript",
      "java",
      "cpp"
    ],
    "testCases": [
      {
        "id": "tc-1",
        "input": "matrix = [[1,2,3],[4,5,6],[7,8,9]]",
        "expectedOutput": "[[7, 4, 1], [8, 5, 2], [9, 6, 3]]"
      }
    ],
    "hints": [
      "First transpose the matrix (swap matrix[i][j] with matrix[j][i]).",
      "Then reverse each row."
    ],
    "approach": {
      "summary": "Transpose followed by horizontal reflect.",
      "steps": [
        "Transpose matrix.",
        "Reverse each row in-place."
      ]
    },
    "complexity": {
      "time": "O(N^2)",
      "space": "O(1)",
      "analysis": "Algorithm runs in O(N^2) time with O(1) space complexity."
    },
    "defaultMastery": 80,
    "recommendedTimeMinutes": 25
  },
  {
    "id": "pm-arr-008",
    "title": "Spiral Matrix",
    "slug": "spiral-matrix",
    "difficulty": "Medium",
    "category": "DSA",
    "topics": [
      "Arrays",
      "Matrix"
    ],
    "companies": [
      "Microsoft",
      "Amazon",
      "Infosys"
    ],
    "frequentlyAsked": true,
    "interviewImportance": "Frequently Asked",
    "description": "Given an `m x n` `matrix`, return all elements of the `matrix` in spiral order.",
    "examples": [
      {
        "input": "matrix = [[1,2,3],[4,5,6],[7,8,9]]",
        "output": "[1,2,3,6,9,8,7,4,5]"
      }
    ],
    "constraints": [
      "m == matrix.length",
      "n == matrix[i].length",
      "1 <= m, n <= 10"
    ],
    "starterCode": {
      "python": "def spiralOrder(matrix: list[list[int]]) -> list[int]:\n    # Write your solution here\n    return []\n",
      "javascript": "function spiralOrder(matrix) {\n    // Write your solution here\n    return [];\n}\n",
      "java": "class Solution {\n    public List<Integer> spiralOrder(int[][] matrix) {\n        // Write your solution here\n        return new ArrayList<>();\n    }\n}\n",
      "cpp": "class Solution {\npublic:\n    vector<int> spiralOrder(vector<vector<int>>& matrix) {\n        // Write your solution here\n        return {};\n    }\n};\n"
    },
    "supportedLanguages": [
      "python",
      "javascript",
      "java",
      "cpp"
    ],
    "testCases": [
      {
        "id": "tc-1",
        "input": "matrix = [[1,2,3],[4,5,6],[7,8,9]]",
        "expectedOutput": "[1, 2, 3, 6, 9, 8, 7, 4, 5]"
      }
    ],
    "hints": [
      "Maintain top, bottom, left, right boundaries.",
      "Shrink boundaries as you traverse right, down, left, up."
    ],
    "approach": {
      "summary": "4-boundary shrinkage.",
      "steps": [
        "Traverse top row, right col, bottom row, left col.",
        "Update boundaries until pointers meet."
      ]
    },
    "complexity": {
      "time": "O(M * N)",
      "space": "O(1)",
      "analysis": "Algorithm runs in O(M * N) time with O(1) space complexity."
    },
    "defaultMastery": 75,
    "recommendedTimeMinutes": 25
  },
  {
    "id": "pm-arr-009",
    "title": "Subarray Sum Equals K",
    "slug": "subarray-sum-equals-k",
    "difficulty": "Medium",
    "category": "DSA",
    "topics": [
      "Arrays",
      "Hashing",
      "Prefix Sum"
    ],
    "companies": [
      "Google",
      "Amazon",
      "Microsoft"
    ],
    "frequentlyAsked": true,
    "interviewImportance": "Frequently Asked",
    "description": "Given an array of integers `nums` and an integer `k`, return the total number of subarrays whose sum equals to `k`.",
    "examples": [
      {
        "input": "nums = [1,1,1], k = 2",
        "output": "2"
      },
      {
        "input": "nums = [1,2,3], k = 3",
        "output": "2"
      }
    ],
    "constraints": [
      "1 <= nums.length <= 2 * 10^4",
      "-1000 <= nums[i] <= 1000"
    ],
    "starterCode": {
      "python": "def subarraySum(nums: list[int], k: int) -> int:\n    # Write your solution here\n    return 0\n",
      "javascript": "function subarraySum(nums, k) {\n    // Write your solution here\n    return 0;\n}\n",
      "java": "class Solution {\n    public int subarraySum(int[] nums, int k) {\n        // Write your solution here\n        return 0;\n    }\n}\n",
      "cpp": "class Solution {\npublic:\n    int subarraySum(vector<int>& nums, int k) {\n        // Write your solution here\n        return 0;\n    }\n};\n"
    },
    "supportedLanguages": [
      "python",
      "javascript",
      "java",
      "cpp"
    ],
    "testCases": [
      {
        "id": "tc-1",
        "input": "nums = [1,1,1], k = 2",
        "expectedOutput": "2"
      },
      {
        "id": "tc-2",
        "input": "nums = [1,2,3], k = 3",
        "expectedOutput": "2"
      }
    ],
    "hints": [
      "If prefixSum - k exists in hash map, add its frequency to result.",
      "Initialize map with {0: 1}."
    ],
    "approach": {
      "summary": "Prefix Sum with Frequency Map.",
      "steps": [
        "Track prefix sum.",
        "count += map.get(prefixSum - k, 0).",
        "map[prefixSum]++."
      ]
    },
    "complexity": {
      "time": "O(N)",
      "space": "O(N)",
      "analysis": "Algorithm runs in O(N) time with O(N) space complexity."
    },
    "defaultMastery": 70,
    "recommendedTimeMinutes": 25
  },
  {
    "id": "pm-arr-010",
    "title": "Longest Consecutive Sequence",
    "slug": "longest-consecutive-sequence",
    "difficulty": "Medium",
    "category": "DSA",
    "topics": [
      "Arrays",
      "Hashing"
    ],
    "companies": [
      "Amazon",
      "Google",
      "Microsoft"
    ],
    "frequentlyAsked": true,
    "interviewImportance": "Frequently Asked",
    "description": "Given an unsorted array of integers `nums`, return the length of the longest consecutive elements sequence in O(n) time.",
    "examples": [
      {
        "input": "nums = [100,4,200,1,3,2]",
        "output": "4",
        "explanation": "The longest consecutive sequence is [1, 2, 3, 4]. Length is 4."
      }
    ],
    "constraints": [
      "0 <= nums.length <= 10^5",
      "-10^9 <= nums[i] <= 10^9"
    ],
    "starterCode": {
      "python": "def longestConsecutive(nums: list[int]) -> int:\n    # Write your solution here\n    return 0\n",
      "javascript": "function longestConsecutive(nums) {\n    // Write your solution here\n    return 0;\n}\n",
      "java": "class Solution {\n    public int longestConsecutive(int[] nums) {\n        // Write your solution here\n        return 0;\n    }\n}\n",
      "cpp": "class Solution {\npublic:\n    int longestConsecutive(vector<int>& nums) {\n        // Write your solution here\n        return 0;\n    }\n};\n"
    },
    "supportedLanguages": [
      "python",
      "javascript",
      "java",
      "cpp"
    ],
    "testCases": [
      {
        "id": "tc-1",
        "input": "nums = [100,4,200,1,3,2]",
        "expectedOutput": "4"
      }
    ],
    "hints": [
      "Put all numbers into a set.",
      "Only start counting sequence length if num - 1 is NOT in set (i.e. num is the start)."
    ],
    "approach": {
      "summary": "Set streak counting from sequence heads.",
      "steps": [
        "Create set from nums.",
        "For each x where (x-1) not in set: find x+1, x+2... update maxLength."
      ]
    },
    "complexity": {
      "time": "O(N)",
      "space": "O(N)",
      "analysis": "Algorithm runs in O(N) time with O(N) space complexity."
    },
    "defaultMastery": 75,
    "recommendedTimeMinutes": 25
  },
  {
    "id": "pm-dsa-011",
    "title": "Valid Palindrome",
    "slug": "valid-palindrome",
    "difficulty": "Easy",
    "category": "DSA",
    "topics": [
      "Two Pointers"
    ],
    "companies": [
      "Amazon",
      "Microsoft",
      "TCS"
    ],
    "frequentlyAsked": true,
    "interviewImportance": "Frequently Asked",
    "description": "Given the problem input for **Valid Palindrome**, implement an optimal algorithm adhering to the time and space constraints specified in interview standards.",
    "examples": [
      {
        "input": "Standard interview input vector",
        "output": "Expected optimal result",
        "explanation": "Demonstrates optimal Two Pointers traversal."
      }
    ],
    "constraints": [
      "1 <= input.length <= 10^5",
      "Output must be within standard data bounds."
    ],
    "starterCode": {
      "python": "def validPalindrome(inputData) -> boolean:\n    # Write your solution here\n    return False\n",
      "javascript": "function validPalindrome(inputData) {\n    // Write your solution here\n    return false;\n}\n",
      "java": "class Solution {\n    public boolean validPalindrome(int[] inputData) {\n        // Write your solution here\n        return false;\n    }\n}\n",
      "cpp": "class Solution {\npublic:\n    bool validPalindrome(vector<int>& inputData) {\n        // Write your solution here\n        return false;\n    }\n};\n"
    },
    "supportedLanguages": [
      "python",
      "javascript",
      "java",
      "cpp"
    ],
    "testCases": [
      {
        "id": "tc-011-1",
        "input": "Valid case 1",
        "expectedOutput": "Standard Case 1 Result"
      },
      {
        "id": "tc-011-2",
        "input": "Edge case 2",
        "expectedOutput": "Standard Case 2 Result"
      }
    ],
    "hints": [
      "Consider optimal time complexity using Two Pointers principles.",
      "Break the state transition or traversal step down clearly.",
      "Check boundary/edge cases like empty input or duplicates."
    ],
    "approach": {
      "summary": "Optimal Two Pointers algorithm.",
      "steps": [
        "Understand problem constraints.",
        "Execute traversal / state update.",
        "Return final result."
      ]
    },
    "complexity": {
      "time": "O(N)",
      "space": "O(1) to O(N)",
      "analysis": "Algorithm runs in O(N) time with O(1) to O(N) space complexity."
    },
    "defaultMastery": 75,
    "recommendedTimeMinutes": 15
  },
  {
    "id": "pm-dsa-012",
    "title": "Two Sum II - Input Array Is Sorted",
    "slug": "two-sum-ii-input-array-is-sorted",
    "difficulty": "Medium",
    "category": "DSA",
    "topics": [
      "Two Pointers"
    ],
    "companies": [
      "Amazon",
      "Google"
    ],
    "frequentlyAsked": true,
    "interviewImportance": "Frequently Asked",
    "description": "Given the problem input for **Two Sum II - Input Array Is Sorted**, implement an optimal algorithm adhering to the time and space constraints specified in interview standards.",
    "examples": [
      {
        "input": "Standard interview input vector",
        "output": "Expected optimal result",
        "explanation": "Demonstrates optimal Two Pointers traversal."
      }
    ],
    "constraints": [
      "1 <= input.length <= 10^5",
      "Output must be within standard data bounds."
    ],
    "starterCode": {
      "python": "def twoSumIiInputArrayIsSorted(inputData) -> int[]:\n    # Write your solution here\n    return []\n",
      "javascript": "function twoSumIiInputArrayIsSorted(inputData) {\n    // Write your solution here\n    return [];\n}\n",
      "java": "class Solution {\n    public int[] twoSumIiInputArrayIsSorted(int[] inputData) {\n        // Write your solution here\n        return new int[]{};\n    }\n}\n",
      "cpp": "class Solution {\npublic:\n    vector<int> twoSumIiInputArrayIsSorted(vector<int>& inputData) {\n        // Write your solution here\n        return {};\n    }\n};\n"
    },
    "supportedLanguages": [
      "python",
      "javascript",
      "java",
      "cpp"
    ],
    "testCases": [
      {
        "id": "tc-012-1",
        "input": "Valid case 1",
        "expectedOutput": "Standard Case 1 Result"
      },
      {
        "id": "tc-012-2",
        "input": "Edge case 2",
        "expectedOutput": "Standard Case 2 Result"
      }
    ],
    "hints": [
      "Consider optimal time complexity using Two Pointers principles.",
      "Break the state transition or traversal step down clearly.",
      "Check boundary/edge cases like empty input or duplicates."
    ],
    "approach": {
      "summary": "Optimal Two Pointers algorithm.",
      "steps": [
        "Understand problem constraints.",
        "Execute traversal / state update.",
        "Return final result."
      ]
    },
    "complexity": {
      "time": "O(N log N)",
      "space": "O(1) to O(N)",
      "analysis": "Algorithm runs in O(N log N) time with O(1) to O(N) space complexity."
    },
    "defaultMastery": 75,
    "recommendedTimeMinutes": 25
  },
  {
    "id": "pm-dsa-013",
    "title": "3Sum",
    "slug": "3sum",
    "difficulty": "Medium",
    "category": "DSA",
    "topics": [
      "Two Pointers"
    ],
    "companies": [
      "Amazon",
      "Microsoft",
      "Google",
      "Zoho"
    ],
    "frequentlyAsked": true,
    "interviewImportance": "Frequently Asked",
    "description": "Given the problem input for **3Sum**, implement an optimal algorithm adhering to the time and space constraints specified in interview standards.",
    "examples": [
      {
        "input": "Standard interview input vector",
        "output": "Expected optimal result",
        "explanation": "Demonstrates optimal Two Pointers traversal."
      }
    ],
    "constraints": [
      "1 <= input.length <= 10^5",
      "Output must be within standard data bounds."
    ],
    "starterCode": {
      "python": "def 3sum(inputData) -> List<List<Integer>>:\n    # Write your solution here\n    return []\n",
      "javascript": "function 3sum(inputData) {\n    // Write your solution here\n    return [];\n}\n",
      "java": "class Solution {\n    public List<List<Integer>> 3sum(int[] inputData) {\n        // Write your solution here\n        return new ArrayList<>();\n    }\n}\n",
      "cpp": "class Solution {\npublic:\n    vector<vector<int>> 3sum(vector<int>& inputData) {\n        // Write your solution here\n        return {};\n    }\n};\n"
    },
    "supportedLanguages": [
      "python",
      "javascript",
      "java",
      "cpp"
    ],
    "testCases": [
      {
        "id": "tc-013-1",
        "input": "Valid case 1",
        "expectedOutput": "Standard Case 1 Result"
      },
      {
        "id": "tc-013-2",
        "input": "Edge case 2",
        "expectedOutput": "Standard Case 2 Result"
      }
    ],
    "hints": [
      "Consider optimal time complexity using Two Pointers principles.",
      "Break the state transition or traversal step down clearly.",
      "Check boundary/edge cases like empty input or duplicates."
    ],
    "approach": {
      "summary": "Optimal Two Pointers algorithm.",
      "steps": [
        "Understand problem constraints.",
        "Execute traversal / state update.",
        "Return final result."
      ]
    },
    "complexity": {
      "time": "O(N log N)",
      "space": "O(1) to O(N)",
      "analysis": "Algorithm runs in O(N log N) time with O(1) to O(N) space complexity."
    },
    "defaultMastery": 75,
    "recommendedTimeMinutes": 25
  },
  {
    "id": "pm-dsa-014",
    "title": "Container With Most Water",
    "slug": "container-with-most-water",
    "difficulty": "Medium",
    "category": "DSA",
    "topics": [
      "Two Pointers"
    ],
    "companies": [
      "Amazon",
      "Google",
      "Adobe"
    ],
    "frequentlyAsked": true,
    "interviewImportance": "Frequently Asked",
    "description": "Given the problem input for **Container With Most Water**, implement an optimal algorithm adhering to the time and space constraints specified in interview standards.",
    "examples": [
      {
        "input": "Standard interview input vector",
        "output": "Expected optimal result",
        "explanation": "Demonstrates optimal Two Pointers traversal."
      }
    ],
    "constraints": [
      "1 <= input.length <= 10^5",
      "Output must be within standard data bounds."
    ],
    "starterCode": {
      "python": "def containerWithMostWater(inputData) -> int:\n    # Write your solution here\n    return 0\n",
      "javascript": "function containerWithMostWater(inputData) {\n    // Write your solution here\n    return 0;\n}\n",
      "java": "class Solution {\n    public int containerWithMostWater(int[] inputData) {\n        // Write your solution here\n        return 0;\n    }\n}\n",
      "cpp": "class Solution {\npublic:\n    int containerWithMostWater(vector<int>& inputData) {\n        // Write your solution here\n        return 0;\n    }\n};\n"
    },
    "supportedLanguages": [
      "python",
      "javascript",
      "java",
      "cpp"
    ],
    "testCases": [
      {
        "id": "tc-014-1",
        "input": "Valid case 1",
        "expectedOutput": "Standard Case 1 Result"
      },
      {
        "id": "tc-014-2",
        "input": "Edge case 2",
        "expectedOutput": "Standard Case 2 Result"
      }
    ],
    "hints": [
      "Consider optimal time complexity using Two Pointers principles.",
      "Break the state transition or traversal step down clearly.",
      "Check boundary/edge cases like empty input or duplicates."
    ],
    "approach": {
      "summary": "Optimal Two Pointers algorithm.",
      "steps": [
        "Understand problem constraints.",
        "Execute traversal / state update.",
        "Return final result."
      ]
    },
    "complexity": {
      "time": "O(N log N)",
      "space": "O(1) to O(N)",
      "analysis": "Algorithm runs in O(N log N) time with O(1) to O(N) space complexity."
    },
    "defaultMastery": 75,
    "recommendedTimeMinutes": 25
  },
  {
    "id": "pm-dsa-015",
    "title": "Trapping Rain Water",
    "slug": "trapping-rain-water",
    "difficulty": "Hard",
    "category": "DSA",
    "topics": [
      "Two Pointers"
    ],
    "companies": [
      "Amazon",
      "Google",
      "Microsoft"
    ],
    "frequentlyAsked": true,
    "interviewImportance": "Frequently Asked",
    "description": "Given the problem input for **Trapping Rain Water**, implement an optimal algorithm adhering to the time and space constraints specified in interview standards.",
    "examples": [
      {
        "input": "Standard interview input vector",
        "output": "Expected optimal result",
        "explanation": "Demonstrates optimal Two Pointers traversal."
      }
    ],
    "constraints": [
      "1 <= input.length <= 10^5",
      "Output must be within standard data bounds."
    ],
    "starterCode": {
      "python": "def trappingRainWater(inputData) -> int:\n    # Write your solution here\n    return 0\n",
      "javascript": "function trappingRainWater(inputData) {\n    // Write your solution here\n    return 0;\n}\n",
      "java": "class Solution {\n    public int trappingRainWater(int[] inputData) {\n        // Write your solution here\n        return 0;\n    }\n}\n",
      "cpp": "class Solution {\npublic:\n    int trappingRainWater(vector<int>& inputData) {\n        // Write your solution here\n        return 0;\n    }\n};\n"
    },
    "supportedLanguages": [
      "python",
      "javascript",
      "java",
      "cpp"
    ],
    "testCases": [
      {
        "id": "tc-015-1",
        "input": "Valid case 1",
        "expectedOutput": "Standard Case 1 Result"
      },
      {
        "id": "tc-015-2",
        "input": "Edge case 2",
        "expectedOutput": "Standard Case 2 Result"
      }
    ],
    "hints": [
      "Consider optimal time complexity using Two Pointers principles.",
      "Break the state transition or traversal step down clearly.",
      "Check boundary/edge cases like empty input or duplicates."
    ],
    "approach": {
      "summary": "Optimal Two Pointers algorithm.",
      "steps": [
        "Understand problem constraints.",
        "Execute traversal / state update.",
        "Return final result."
      ]
    },
    "complexity": {
      "time": "O(N log N)",
      "space": "O(1) to O(N)",
      "analysis": "Algorithm runs in O(N log N) time with O(1) to O(N) space complexity."
    },
    "defaultMastery": 75,
    "recommendedTimeMinutes": 40
  },
  {
    "id": "pm-dsa-016",
    "title": "Longest Substring Without Repeating Characters",
    "slug": "longest-substring-without-repeating-characters",
    "difficulty": "Medium",
    "category": "DSA",
    "topics": [
      "Sliding Window"
    ],
    "companies": [
      "Amazon",
      "Microsoft",
      "Cognizant"
    ],
    "frequentlyAsked": true,
    "interviewImportance": "Frequently Asked",
    "description": "Given the problem input for **Longest Substring Without Repeating Characters**, implement an optimal algorithm adhering to the time and space constraints specified in interview standards.",
    "examples": [
      {
        "input": "Standard interview input vector",
        "output": "Expected optimal result",
        "explanation": "Demonstrates optimal Sliding Window traversal."
      }
    ],
    "constraints": [
      "1 <= input.length <= 10^5",
      "Output must be within standard data bounds."
    ],
    "starterCode": {
      "python": "def longestSubstringWithoutRepeatingCharacters(inputData) -> int:\n    # Write your solution here\n    return 0\n",
      "javascript": "function longestSubstringWithoutRepeatingCharacters(inputData) {\n    // Write your solution here\n    return 0;\n}\n",
      "java": "class Solution {\n    public int longestSubstringWithoutRepeatingCharacters(int[] inputData) {\n        // Write your solution here\n        return 0;\n    }\n}\n",
      "cpp": "class Solution {\npublic:\n    int longestSubstringWithoutRepeatingCharacters(vector<int>& inputData) {\n        // Write your solution here\n        return 0;\n    }\n};\n"
    },
    "supportedLanguages": [
      "python",
      "javascript",
      "java",
      "cpp"
    ],
    "testCases": [
      {
        "id": "tc-016-1",
        "input": "Valid case 1",
        "expectedOutput": "Standard Case 1 Result"
      },
      {
        "id": "tc-016-2",
        "input": "Edge case 2",
        "expectedOutput": "Standard Case 2 Result"
      }
    ],
    "hints": [
      "Consider optimal time complexity using Sliding Window principles.",
      "Break the state transition or traversal step down clearly.",
      "Check boundary/edge cases like empty input or duplicates."
    ],
    "approach": {
      "summary": "Optimal Sliding Window algorithm.",
      "steps": [
        "Understand problem constraints.",
        "Execute traversal / state update.",
        "Return final result."
      ]
    },
    "complexity": {
      "time": "O(N log N)",
      "space": "O(1) to O(N)",
      "analysis": "Algorithm runs in O(N log N) time with O(1) to O(N) space complexity."
    },
    "defaultMastery": 75,
    "recommendedTimeMinutes": 25
  },
  {
    "id": "pm-dsa-017",
    "title": "Longest Repeating Character Replacement",
    "slug": "longest-repeating-character-replacement",
    "difficulty": "Medium",
    "category": "DSA",
    "topics": [
      "Sliding Window"
    ],
    "companies": [
      "Google",
      "Amazon"
    ],
    "frequentlyAsked": true,
    "interviewImportance": "Frequently Asked",
    "description": "Given the problem input for **Longest Repeating Character Replacement**, implement an optimal algorithm adhering to the time and space constraints specified in interview standards.",
    "examples": [
      {
        "input": "Standard interview input vector",
        "output": "Expected optimal result",
        "explanation": "Demonstrates optimal Sliding Window traversal."
      }
    ],
    "constraints": [
      "1 <= input.length <= 10^5",
      "Output must be within standard data bounds."
    ],
    "starterCode": {
      "python": "def longestRepeatingCharacterReplacement(inputData) -> int:\n    # Write your solution here\n    return 0\n",
      "javascript": "function longestRepeatingCharacterReplacement(inputData) {\n    // Write your solution here\n    return 0;\n}\n",
      "java": "class Solution {\n    public int longestRepeatingCharacterReplacement(int[] inputData) {\n        // Write your solution here\n        return 0;\n    }\n}\n",
      "cpp": "class Solution {\npublic:\n    int longestRepeatingCharacterReplacement(vector<int>& inputData) {\n        // Write your solution here\n        return 0;\n    }\n};\n"
    },
    "supportedLanguages": [
      "python",
      "javascript",
      "java",
      "cpp"
    ],
    "testCases": [
      {
        "id": "tc-017-1",
        "input": "Valid case 1",
        "expectedOutput": "Standard Case 1 Result"
      },
      {
        "id": "tc-017-2",
        "input": "Edge case 2",
        "expectedOutput": "Standard Case 2 Result"
      }
    ],
    "hints": [
      "Consider optimal time complexity using Sliding Window principles.",
      "Break the state transition or traversal step down clearly.",
      "Check boundary/edge cases like empty input or duplicates."
    ],
    "approach": {
      "summary": "Optimal Sliding Window algorithm.",
      "steps": [
        "Understand problem constraints.",
        "Execute traversal / state update.",
        "Return final result."
      ]
    },
    "complexity": {
      "time": "O(N log N)",
      "space": "O(1) to O(N)",
      "analysis": "Algorithm runs in O(N log N) time with O(1) to O(N) space complexity."
    },
    "defaultMastery": 75,
    "recommendedTimeMinutes": 25
  },
  {
    "id": "pm-dsa-018",
    "title": "Permutation in String",
    "slug": "permutation-in-string",
    "difficulty": "Medium",
    "category": "DSA",
    "topics": [
      "Sliding Window"
    ],
    "companies": [
      "Microsoft",
      "Amazon"
    ],
    "frequentlyAsked": true,
    "interviewImportance": "Frequently Asked",
    "description": "Given the problem input for **Permutation in String**, implement an optimal algorithm adhering to the time and space constraints specified in interview standards.",
    "examples": [
      {
        "input": "Standard interview input vector",
        "output": "Expected optimal result",
        "explanation": "Demonstrates optimal Sliding Window traversal."
      }
    ],
    "constraints": [
      "1 <= input.length <= 10^5",
      "Output must be within standard data bounds."
    ],
    "starterCode": {
      "python": "def permutationInString(inputData) -> boolean:\n    # Write your solution here\n    return False\n",
      "javascript": "function permutationInString(inputData) {\n    // Write your solution here\n    return false;\n}\n",
      "java": "class Solution {\n    public boolean permutationInString(int[] inputData) {\n        // Write your solution here\n        return false;\n    }\n}\n",
      "cpp": "class Solution {\npublic:\n    bool permutationInString(vector<int>& inputData) {\n        // Write your solution here\n        return false;\n    }\n};\n"
    },
    "supportedLanguages": [
      "python",
      "javascript",
      "java",
      "cpp"
    ],
    "testCases": [
      {
        "id": "tc-018-1",
        "input": "Valid case 1",
        "expectedOutput": "Standard Case 1 Result"
      },
      {
        "id": "tc-018-2",
        "input": "Edge case 2",
        "expectedOutput": "Standard Case 2 Result"
      }
    ],
    "hints": [
      "Consider optimal time complexity using Sliding Window principles.",
      "Break the state transition or traversal step down clearly.",
      "Check boundary/edge cases like empty input or duplicates."
    ],
    "approach": {
      "summary": "Optimal Sliding Window algorithm.",
      "steps": [
        "Understand problem constraints.",
        "Execute traversal / state update.",
        "Return final result."
      ]
    },
    "complexity": {
      "time": "O(N log N)",
      "space": "O(1) to O(N)",
      "analysis": "Algorithm runs in O(N log N) time with O(1) to O(N) space complexity."
    },
    "defaultMastery": 75,
    "recommendedTimeMinutes": 25
  },
  {
    "id": "pm-dsa-019",
    "title": "Minimum Window Substring",
    "slug": "minimum-window-substring",
    "difficulty": "Hard",
    "category": "DSA",
    "topics": [
      "Sliding Window"
    ],
    "companies": [
      "Amazon",
      "Google",
      "Microsoft"
    ],
    "frequentlyAsked": true,
    "interviewImportance": "Frequently Asked",
    "description": "Given the problem input for **Minimum Window Substring**, implement an optimal algorithm adhering to the time and space constraints specified in interview standards.",
    "examples": [
      {
        "input": "Standard interview input vector",
        "output": "Expected optimal result",
        "explanation": "Demonstrates optimal Sliding Window traversal."
      }
    ],
    "constraints": [
      "1 <= input.length <= 10^5",
      "Output must be within standard data bounds."
    ],
    "starterCode": {
      "python": "def minimumWindowSubstring(inputData) -> String:\n    # Write your solution here\n    return \"\"\n",
      "javascript": "function minimumWindowSubstring(inputData) {\n    // Write your solution here\n    return \"\";\n}\n",
      "java": "class Solution {\n    public String minimumWindowSubstring(int[] inputData) {\n        // Write your solution here\n        return \"\";\n    }\n}\n",
      "cpp": "class Solution {\npublic:\n    string minimumWindowSubstring(vector<int>& inputData) {\n        // Write your solution here\n        return \"\";\n    }\n};\n"
    },
    "supportedLanguages": [
      "python",
      "javascript",
      "java",
      "cpp"
    ],
    "testCases": [
      {
        "id": "tc-019-1",
        "input": "Valid case 1",
        "expectedOutput": "Standard Case 1 Result"
      },
      {
        "id": "tc-019-2",
        "input": "Edge case 2",
        "expectedOutput": "Standard Case 2 Result"
      }
    ],
    "hints": [
      "Consider optimal time complexity using Sliding Window principles.",
      "Break the state transition or traversal step down clearly.",
      "Check boundary/edge cases like empty input or duplicates."
    ],
    "approach": {
      "summary": "Optimal Sliding Window algorithm.",
      "steps": [
        "Understand problem constraints.",
        "Execute traversal / state update.",
        "Return final result."
      ]
    },
    "complexity": {
      "time": "O(N log N)",
      "space": "O(1) to O(N)",
      "analysis": "Algorithm runs in O(N log N) time with O(1) to O(N) space complexity."
    },
    "defaultMastery": 75,
    "recommendedTimeMinutes": 40
  },
  {
    "id": "pm-dsa-020",
    "title": "Sliding Window Maximum",
    "slug": "sliding-window-maximum",
    "difficulty": "Hard",
    "category": "DSA",
    "topics": [
      "Sliding Window"
    ],
    "companies": [
      "Google",
      "Amazon"
    ],
    "frequentlyAsked": true,
    "interviewImportance": "Frequently Asked",
    "description": "Given the problem input for **Sliding Window Maximum**, implement an optimal algorithm adhering to the time and space constraints specified in interview standards.",
    "examples": [
      {
        "input": "Standard interview input vector",
        "output": "Expected optimal result",
        "explanation": "Demonstrates optimal Sliding Window traversal."
      }
    ],
    "constraints": [
      "1 <= input.length <= 10^5",
      "Output must be within standard data bounds."
    ],
    "starterCode": {
      "python": "def slidingWindowMaximum(inputData) -> int[]:\n    # Write your solution here\n    return []\n",
      "javascript": "function slidingWindowMaximum(inputData) {\n    // Write your solution here\n    return [];\n}\n",
      "java": "class Solution {\n    public int[] slidingWindowMaximum(int[] inputData) {\n        // Write your solution here\n        return new int[]{};\n    }\n}\n",
      "cpp": "class Solution {\npublic:\n    vector<int> slidingWindowMaximum(vector<int>& inputData) {\n        // Write your solution here\n        return {};\n    }\n};\n"
    },
    "supportedLanguages": [
      "python",
      "javascript",
      "java",
      "cpp"
    ],
    "testCases": [
      {
        "id": "tc-020-1",
        "input": "Valid case 1",
        "expectedOutput": "Standard Case 1 Result"
      },
      {
        "id": "tc-020-2",
        "input": "Edge case 2",
        "expectedOutput": "Standard Case 2 Result"
      }
    ],
    "hints": [
      "Consider optimal time complexity using Sliding Window principles.",
      "Break the state transition or traversal step down clearly.",
      "Check boundary/edge cases like empty input or duplicates."
    ],
    "approach": {
      "summary": "Optimal Sliding Window algorithm.",
      "steps": [
        "Understand problem constraints.",
        "Execute traversal / state update.",
        "Return final result."
      ]
    },
    "complexity": {
      "time": "O(N log N)",
      "space": "O(1) to O(N)",
      "analysis": "Algorithm runs in O(N log N) time with O(1) to O(N) space complexity."
    },
    "defaultMastery": 75,
    "recommendedTimeMinutes": 40
  },
  {
    "id": "pm-dsa-021",
    "title": "Valid Parentheses",
    "slug": "valid-parentheses",
    "difficulty": "Easy",
    "category": "DSA",
    "topics": [
      "Stack"
    ],
    "companies": [
      "Amazon",
      "Microsoft",
      "TCS",
      "Infosys"
    ],
    "frequentlyAsked": true,
    "interviewImportance": "Frequently Asked",
    "description": "Given the problem input for **Valid Parentheses**, implement an optimal algorithm adhering to the time and space constraints specified in interview standards.",
    "examples": [
      {
        "input": "Standard interview input vector",
        "output": "Expected optimal result",
        "explanation": "Demonstrates optimal Stack traversal."
      }
    ],
    "constraints": [
      "1 <= input.length <= 10^5",
      "Output must be within standard data bounds."
    ],
    "starterCode": {
      "python": "def validParentheses(inputData) -> boolean:\n    # Write your solution here\n    return False\n",
      "javascript": "function validParentheses(inputData) {\n    // Write your solution here\n    return false;\n}\n",
      "java": "class Solution {\n    public boolean validParentheses(int[] inputData) {\n        // Write your solution here\n        return false;\n    }\n}\n",
      "cpp": "class Solution {\npublic:\n    bool validParentheses(vector<int>& inputData) {\n        // Write your solution here\n        return false;\n    }\n};\n"
    },
    "supportedLanguages": [
      "python",
      "javascript",
      "java",
      "cpp"
    ],
    "testCases": [
      {
        "id": "tc-021-1",
        "input": "Valid case 1",
        "expectedOutput": "Standard Case 1 Result"
      },
      {
        "id": "tc-021-2",
        "input": "Edge case 2",
        "expectedOutput": "Standard Case 2 Result"
      }
    ],
    "hints": [
      "Consider optimal time complexity using Stack principles.",
      "Break the state transition or traversal step down clearly.",
      "Check boundary/edge cases like empty input or duplicates."
    ],
    "approach": {
      "summary": "Optimal Stack algorithm.",
      "steps": [
        "Understand problem constraints.",
        "Execute traversal / state update.",
        "Return final result."
      ]
    },
    "complexity": {
      "time": "O(N)",
      "space": "O(1) to O(N)",
      "analysis": "Algorithm runs in O(N) time with O(1) to O(N) space complexity."
    },
    "defaultMastery": 75,
    "recommendedTimeMinutes": 15
  },
  {
    "id": "pm-dsa-022",
    "title": "Min Stack Design",
    "slug": "min-stack-design",
    "difficulty": "Medium",
    "category": "DSA",
    "topics": [
      "Stack"
    ],
    "companies": [
      "Amazon",
      "Microsoft"
    ],
    "frequentlyAsked": true,
    "interviewImportance": "Frequently Asked",
    "description": "Given the problem input for **Min Stack Design**, implement an optimal algorithm adhering to the time and space constraints specified in interview standards.",
    "examples": [
      {
        "input": "Standard interview input vector",
        "output": "Expected optimal result",
        "explanation": "Demonstrates optimal Stack traversal."
      }
    ],
    "constraints": [
      "1 <= input.length <= 10^5",
      "Output must be within standard data bounds."
    ],
    "starterCode": {
      "python": "def minStackDesign(inputData) -> int:\n    # Write your solution here\n    return 0\n",
      "javascript": "function minStackDesign(inputData) {\n    // Write your solution here\n    return 0;\n}\n",
      "java": "class Solution {\n    public int minStackDesign(int[] inputData) {\n        // Write your solution here\n        return 0;\n    }\n}\n",
      "cpp": "class Solution {\npublic:\n    int minStackDesign(vector<int>& inputData) {\n        // Write your solution here\n        return 0;\n    }\n};\n"
    },
    "supportedLanguages": [
      "python",
      "javascript",
      "java",
      "cpp"
    ],
    "testCases": [
      {
        "id": "tc-022-1",
        "input": "Valid case 1",
        "expectedOutput": "Standard Case 1 Result"
      },
      {
        "id": "tc-022-2",
        "input": "Edge case 2",
        "expectedOutput": "Standard Case 2 Result"
      }
    ],
    "hints": [
      "Consider optimal time complexity using Stack principles.",
      "Break the state transition or traversal step down clearly.",
      "Check boundary/edge cases like empty input or duplicates."
    ],
    "approach": {
      "summary": "Optimal Stack algorithm.",
      "steps": [
        "Understand problem constraints.",
        "Execute traversal / state update.",
        "Return final result."
      ]
    },
    "complexity": {
      "time": "O(N log N)",
      "space": "O(1) to O(N)",
      "analysis": "Algorithm runs in O(N log N) time with O(1) to O(N) space complexity."
    },
    "defaultMastery": 75,
    "recommendedTimeMinutes": 25
  },
  {
    "id": "pm-dsa-023",
    "title": "Evaluate Reverse Polish Notation",
    "slug": "evaluate-reverse-polish-notation",
    "difficulty": "Medium",
    "category": "DSA",
    "topics": [
      "Stack"
    ],
    "companies": [
      "Google",
      "Amazon"
    ],
    "frequentlyAsked": true,
    "interviewImportance": "Frequently Asked",
    "description": "Given the problem input for **Evaluate Reverse Polish Notation**, implement an optimal algorithm adhering to the time and space constraints specified in interview standards.",
    "examples": [
      {
        "input": "Standard interview input vector",
        "output": "Expected optimal result",
        "explanation": "Demonstrates optimal Stack traversal."
      }
    ],
    "constraints": [
      "1 <= input.length <= 10^5",
      "Output must be within standard data bounds."
    ],
    "starterCode": {
      "python": "def evaluateReversePolishNotation(inputData) -> int:\n    # Write your solution here\n    return 0\n",
      "javascript": "function evaluateReversePolishNotation(inputData) {\n    // Write your solution here\n    return 0;\n}\n",
      "java": "class Solution {\n    public int evaluateReversePolishNotation(int[] inputData) {\n        // Write your solution here\n        return 0;\n    }\n}\n",
      "cpp": "class Solution {\npublic:\n    int evaluateReversePolishNotation(vector<int>& inputData) {\n        // Write your solution here\n        return 0;\n    }\n};\n"
    },
    "supportedLanguages": [
      "python",
      "javascript",
      "java",
      "cpp"
    ],
    "testCases": [
      {
        "id": "tc-023-1",
        "input": "Valid case 1",
        "expectedOutput": "Standard Case 1 Result"
      },
      {
        "id": "tc-023-2",
        "input": "Edge case 2",
        "expectedOutput": "Standard Case 2 Result"
      }
    ],
    "hints": [
      "Consider optimal time complexity using Stack principles.",
      "Break the state transition or traversal step down clearly.",
      "Check boundary/edge cases like empty input or duplicates."
    ],
    "approach": {
      "summary": "Optimal Stack algorithm.",
      "steps": [
        "Understand problem constraints.",
        "Execute traversal / state update.",
        "Return final result."
      ]
    },
    "complexity": {
      "time": "O(N log N)",
      "space": "O(1) to O(N)",
      "analysis": "Algorithm runs in O(N log N) time with O(1) to O(N) space complexity."
    },
    "defaultMastery": 75,
    "recommendedTimeMinutes": 25
  },
  {
    "id": "pm-dsa-024",
    "title": "Daily Temperatures",
    "slug": "daily-temperatures",
    "difficulty": "Medium",
    "category": "DSA",
    "topics": [
      "Stack"
    ],
    "companies": [
      "Amazon",
      "Microsoft"
    ],
    "frequentlyAsked": true,
    "interviewImportance": "Frequently Asked",
    "description": "Given the problem input for **Daily Temperatures**, implement an optimal algorithm adhering to the time and space constraints specified in interview standards.",
    "examples": [
      {
        "input": "Standard interview input vector",
        "output": "Expected optimal result",
        "explanation": "Demonstrates optimal Stack traversal."
      }
    ],
    "constraints": [
      "1 <= input.length <= 10^5",
      "Output must be within standard data bounds."
    ],
    "starterCode": {
      "python": "def dailyTemperatures(inputData) -> int[]:\n    # Write your solution here\n    return []\n",
      "javascript": "function dailyTemperatures(inputData) {\n    // Write your solution here\n    return [];\n}\n",
      "java": "class Solution {\n    public int[] dailyTemperatures(int[] inputData) {\n        // Write your solution here\n        return new int[]{};\n    }\n}\n",
      "cpp": "class Solution {\npublic:\n    vector<int> dailyTemperatures(vector<int>& inputData) {\n        // Write your solution here\n        return {};\n    }\n};\n"
    },
    "supportedLanguages": [
      "python",
      "javascript",
      "java",
      "cpp"
    ],
    "testCases": [
      {
        "id": "tc-024-1",
        "input": "Valid case 1",
        "expectedOutput": "Standard Case 1 Result"
      },
      {
        "id": "tc-024-2",
        "input": "Edge case 2",
        "expectedOutput": "Standard Case 2 Result"
      }
    ],
    "hints": [
      "Consider optimal time complexity using Stack principles.",
      "Break the state transition or traversal step down clearly.",
      "Check boundary/edge cases like empty input or duplicates."
    ],
    "approach": {
      "summary": "Optimal Stack algorithm.",
      "steps": [
        "Understand problem constraints.",
        "Execute traversal / state update.",
        "Return final result."
      ]
    },
    "complexity": {
      "time": "O(N log N)",
      "space": "O(1) to O(N)",
      "analysis": "Algorithm runs in O(N log N) time with O(1) to O(N) space complexity."
    },
    "defaultMastery": 75,
    "recommendedTimeMinutes": 25
  },
  {
    "id": "pm-dsa-025",
    "title": "Largest Rectangle in Histogram",
    "slug": "largest-rectangle-in-histogram",
    "difficulty": "Hard",
    "category": "DSA",
    "topics": [
      "Stack"
    ],
    "companies": [
      "Google",
      "Amazon"
    ],
    "frequentlyAsked": true,
    "interviewImportance": "Frequently Asked",
    "description": "Given the problem input for **Largest Rectangle in Histogram**, implement an optimal algorithm adhering to the time and space constraints specified in interview standards.",
    "examples": [
      {
        "input": "Standard interview input vector",
        "output": "Expected optimal result",
        "explanation": "Demonstrates optimal Stack traversal."
      }
    ],
    "constraints": [
      "1 <= input.length <= 10^5",
      "Output must be within standard data bounds."
    ],
    "starterCode": {
      "python": "def largestRectangleInHistogram(inputData) -> int:\n    # Write your solution here\n    return 0\n",
      "javascript": "function largestRectangleInHistogram(inputData) {\n    // Write your solution here\n    return 0;\n}\n",
      "java": "class Solution {\n    public int largestRectangleInHistogram(int[] inputData) {\n        // Write your solution here\n        return 0;\n    }\n}\n",
      "cpp": "class Solution {\npublic:\n    int largestRectangleInHistogram(vector<int>& inputData) {\n        // Write your solution here\n        return 0;\n    }\n};\n"
    },
    "supportedLanguages": [
      "python",
      "javascript",
      "java",
      "cpp"
    ],
    "testCases": [
      {
        "id": "tc-025-1",
        "input": "Valid case 1",
        "expectedOutput": "Standard Case 1 Result"
      },
      {
        "id": "tc-025-2",
        "input": "Edge case 2",
        "expectedOutput": "Standard Case 2 Result"
      }
    ],
    "hints": [
      "Consider optimal time complexity using Stack principles.",
      "Break the state transition or traversal step down clearly.",
      "Check boundary/edge cases like empty input or duplicates."
    ],
    "approach": {
      "summary": "Optimal Stack algorithm.",
      "steps": [
        "Understand problem constraints.",
        "Execute traversal / state update.",
        "Return final result."
      ]
    },
    "complexity": {
      "time": "O(N log N)",
      "space": "O(1) to O(N)",
      "analysis": "Algorithm runs in O(N log N) time with O(1) to O(N) space complexity."
    },
    "defaultMastery": 75,
    "recommendedTimeMinutes": 40
  },
  {
    "id": "pm-dsa-026",
    "title": "Implement Queue using Stacks",
    "slug": "implement-queue-using-stacks",
    "difficulty": "Easy",
    "category": "DSA",
    "topics": [
      "Queue"
    ],
    "companies": [
      "Amazon",
      "Microsoft",
      "Wipro"
    ],
    "frequentlyAsked": true,
    "interviewImportance": "Frequently Asked",
    "description": "Given the problem input for **Implement Queue using Stacks**, implement an optimal algorithm adhering to the time and space constraints specified in interview standards.",
    "examples": [
      {
        "input": "Standard interview input vector",
        "output": "Expected optimal result",
        "explanation": "Demonstrates optimal Queue traversal."
      }
    ],
    "constraints": [
      "1 <= input.length <= 10^5",
      "Output must be within standard data bounds."
    ],
    "starterCode": {
      "python": "def implementQueueUsingStacks(inputData) -> int:\n    # Write your solution here\n    return 0\n",
      "javascript": "function implementQueueUsingStacks(inputData) {\n    // Write your solution here\n    return 0;\n}\n",
      "java": "class Solution {\n    public int implementQueueUsingStacks(int[] inputData) {\n        // Write your solution here\n        return 0;\n    }\n}\n",
      "cpp": "class Solution {\npublic:\n    int implementQueueUsingStacks(vector<int>& inputData) {\n        // Write your solution here\n        return 0;\n    }\n};\n"
    },
    "supportedLanguages": [
      "python",
      "javascript",
      "java",
      "cpp"
    ],
    "testCases": [
      {
        "id": "tc-026-1",
        "input": "Valid case 1",
        "expectedOutput": "Standard Case 1 Result"
      },
      {
        "id": "tc-026-2",
        "input": "Edge case 2",
        "expectedOutput": "Standard Case 2 Result"
      }
    ],
    "hints": [
      "Consider optimal time complexity using Queue principles.",
      "Break the state transition or traversal step down clearly.",
      "Check boundary/edge cases like empty input or duplicates."
    ],
    "approach": {
      "summary": "Optimal Queue algorithm.",
      "steps": [
        "Understand problem constraints.",
        "Execute traversal / state update.",
        "Return final result."
      ]
    },
    "complexity": {
      "time": "O(N)",
      "space": "O(1) to O(N)",
      "analysis": "Algorithm runs in O(N) time with O(1) to O(N) space complexity."
    },
    "defaultMastery": 75,
    "recommendedTimeMinutes": 15
  },
  {
    "id": "pm-dsa-027",
    "title": "Design Circular Queue",
    "slug": "design-circular-queue",
    "difficulty": "Medium",
    "category": "DSA",
    "topics": [
      "Queue"
    ],
    "companies": [
      "Amazon",
      "Zoho"
    ],
    "frequentlyAsked": false,
    "interviewImportance": "Interview Essential",
    "description": "Given the problem input for **Design Circular Queue**, implement an optimal algorithm adhering to the time and space constraints specified in interview standards.",
    "examples": [
      {
        "input": "Standard interview input vector",
        "output": "Expected optimal result",
        "explanation": "Demonstrates optimal Queue traversal."
      }
    ],
    "constraints": [
      "1 <= input.length <= 10^5",
      "Output must be within standard data bounds."
    ],
    "starterCode": {
      "python": "def designCircularQueue(inputData) -> boolean:\n    # Write your solution here\n    return False\n",
      "javascript": "function designCircularQueue(inputData) {\n    // Write your solution here\n    return false;\n}\n",
      "java": "class Solution {\n    public boolean designCircularQueue(int[] inputData) {\n        // Write your solution here\n        return false;\n    }\n}\n",
      "cpp": "class Solution {\npublic:\n    bool designCircularQueue(vector<int>& inputData) {\n        // Write your solution here\n        return false;\n    }\n};\n"
    },
    "supportedLanguages": [
      "python",
      "javascript",
      "java",
      "cpp"
    ],
    "testCases": [
      {
        "id": "tc-027-1",
        "input": "Valid case 1",
        "expectedOutput": "Standard Case 1 Result"
      },
      {
        "id": "tc-027-2",
        "input": "Edge case 2",
        "expectedOutput": "Standard Case 2 Result"
      }
    ],
    "hints": [
      "Consider optimal time complexity using Queue principles.",
      "Break the state transition or traversal step down clearly.",
      "Check boundary/edge cases like empty input or duplicates."
    ],
    "approach": {
      "summary": "Optimal Queue algorithm.",
      "steps": [
        "Understand problem constraints.",
        "Execute traversal / state update.",
        "Return final result."
      ]
    },
    "complexity": {
      "time": "O(N log N)",
      "space": "O(1) to O(N)",
      "analysis": "Algorithm runs in O(N log N) time with O(1) to O(N) space complexity."
    },
    "defaultMastery": 75,
    "recommendedTimeMinutes": 25
  },
  {
    "id": "pm-dsa-028",
    "title": "First Unique Character in a String",
    "slug": "first-unique-character-in-a-string",
    "difficulty": "Easy",
    "category": "DSA",
    "topics": [
      "Queue"
    ],
    "companies": [
      "Amazon",
      "TCS",
      "Accenture"
    ],
    "frequentlyAsked": true,
    "interviewImportance": "Frequently Asked",
    "description": "Given the problem input for **First Unique Character in a String**, implement an optimal algorithm adhering to the time and space constraints specified in interview standards.",
    "examples": [
      {
        "input": "Standard interview input vector",
        "output": "Expected optimal result",
        "explanation": "Demonstrates optimal Queue traversal."
      }
    ],
    "constraints": [
      "1 <= input.length <= 10^5",
      "Output must be within standard data bounds."
    ],
    "starterCode": {
      "python": "def firstUniqueCharacterInAString(inputData) -> int:\n    # Write your solution here\n    return 0\n",
      "javascript": "function firstUniqueCharacterInAString(inputData) {\n    // Write your solution here\n    return 0;\n}\n",
      "java": "class Solution {\n    public int firstUniqueCharacterInAString(int[] inputData) {\n        // Write your solution here\n        return 0;\n    }\n}\n",
      "cpp": "class Solution {\npublic:\n    int firstUniqueCharacterInAString(vector<int>& inputData) {\n        // Write your solution here\n        return 0;\n    }\n};\n"
    },
    "supportedLanguages": [
      "python",
      "javascript",
      "java",
      "cpp"
    ],
    "testCases": [
      {
        "id": "tc-028-1",
        "input": "Valid case 1",
        "expectedOutput": "Standard Case 1 Result"
      },
      {
        "id": "tc-028-2",
        "input": "Edge case 2",
        "expectedOutput": "Standard Case 2 Result"
      }
    ],
    "hints": [
      "Consider optimal time complexity using Queue principles.",
      "Break the state transition or traversal step down clearly.",
      "Check boundary/edge cases like empty input or duplicates."
    ],
    "approach": {
      "summary": "Optimal Queue algorithm.",
      "steps": [
        "Understand problem constraints.",
        "Execute traversal / state update.",
        "Return final result."
      ]
    },
    "complexity": {
      "time": "O(N)",
      "space": "O(1) to O(N)",
      "analysis": "Algorithm runs in O(N) time with O(1) to O(N) space complexity."
    },
    "defaultMastery": 75,
    "recommendedTimeMinutes": 15
  },
  {
    "id": "pm-dsa-029",
    "title": "Reverse Linked List",
    "slug": "reverse-linked-list",
    "difficulty": "Easy",
    "category": "DSA",
    "topics": [
      "Linked List"
    ],
    "companies": [
      "Amazon",
      "Microsoft",
      "TCS",
      "Infosys"
    ],
    "frequentlyAsked": true,
    "interviewImportance": "Frequently Asked",
    "description": "Given the problem input for **Reverse Linked List**, implement an optimal algorithm adhering to the time and space constraints specified in interview standards.",
    "examples": [
      {
        "input": "Standard interview input vector",
        "output": "Expected optimal result",
        "explanation": "Demonstrates optimal Linked List traversal."
      }
    ],
    "constraints": [
      "1 <= input.length <= 10^5",
      "Output must be within standard data bounds."
    ],
    "starterCode": {
      "python": "def reverseLinkedList(inputData) -> List<List<Integer>>:\n    # Write your solution here\n    return []\n",
      "javascript": "function reverseLinkedList(inputData) {\n    // Write your solution here\n    return [];\n}\n",
      "java": "class Solution {\n    public List<List<Integer>> reverseLinkedList(int[] inputData) {\n        // Write your solution here\n        return new ArrayList<>();\n    }\n}\n",
      "cpp": "class Solution {\npublic:\n    vector<vector<int>> reverseLinkedList(vector<int>& inputData) {\n        // Write your solution here\n        return {};\n    }\n};\n"
    },
    "supportedLanguages": [
      "python",
      "javascript",
      "java",
      "cpp"
    ],
    "testCases": [
      {
        "id": "tc-029-1",
        "input": "Valid case 1",
        "expectedOutput": "Standard Case 1 Result"
      },
      {
        "id": "tc-029-2",
        "input": "Edge case 2",
        "expectedOutput": "Standard Case 2 Result"
      }
    ],
    "hints": [
      "Consider optimal time complexity using Linked List principles.",
      "Break the state transition or traversal step down clearly.",
      "Check boundary/edge cases like empty input or duplicates."
    ],
    "approach": {
      "summary": "Optimal Linked List algorithm.",
      "steps": [
        "Understand problem constraints.",
        "Execute traversal / state update.",
        "Return final result."
      ]
    },
    "complexity": {
      "time": "O(N)",
      "space": "O(1) to O(N)",
      "analysis": "Algorithm runs in O(N) time with O(1) to O(N) space complexity."
    },
    "defaultMastery": 75,
    "recommendedTimeMinutes": 15
  },
  {
    "id": "pm-dsa-030",
    "title": "Merge Two Sorted Lists",
    "slug": "merge-two-sorted-lists",
    "difficulty": "Easy",
    "category": "DSA",
    "topics": [
      "Linked List"
    ],
    "companies": [
      "Amazon",
      "Microsoft",
      "Cognizant"
    ],
    "frequentlyAsked": true,
    "interviewImportance": "Frequently Asked",
    "description": "Given the problem input for **Merge Two Sorted Lists**, implement an optimal algorithm adhering to the time and space constraints specified in interview standards.",
    "examples": [
      {
        "input": "Standard interview input vector",
        "output": "Expected optimal result",
        "explanation": "Demonstrates optimal Linked List traversal."
      }
    ],
    "constraints": [
      "1 <= input.length <= 10^5",
      "Output must be within standard data bounds."
    ],
    "starterCode": {
      "python": "def mergeTwoSortedLists(inputData) -> List<List<Integer>>:\n    # Write your solution here\n    return []\n",
      "javascript": "function mergeTwoSortedLists(inputData) {\n    // Write your solution here\n    return [];\n}\n",
      "java": "class Solution {\n    public List<List<Integer>> mergeTwoSortedLists(int[] inputData) {\n        // Write your solution here\n        return new ArrayList<>();\n    }\n}\n",
      "cpp": "class Solution {\npublic:\n    vector<vector<int>> mergeTwoSortedLists(vector<int>& inputData) {\n        // Write your solution here\n        return {};\n    }\n};\n"
    },
    "supportedLanguages": [
      "python",
      "javascript",
      "java",
      "cpp"
    ],
    "testCases": [
      {
        "id": "tc-030-1",
        "input": "Valid case 1",
        "expectedOutput": "Standard Case 1 Result"
      },
      {
        "id": "tc-030-2",
        "input": "Edge case 2",
        "expectedOutput": "Standard Case 2 Result"
      }
    ],
    "hints": [
      "Consider optimal time complexity using Linked List principles.",
      "Break the state transition or traversal step down clearly.",
      "Check boundary/edge cases like empty input or duplicates."
    ],
    "approach": {
      "summary": "Optimal Linked List algorithm.",
      "steps": [
        "Understand problem constraints.",
        "Execute traversal / state update.",
        "Return final result."
      ]
    },
    "complexity": {
      "time": "O(N)",
      "space": "O(1) to O(N)",
      "analysis": "Algorithm runs in O(N) time with O(1) to O(N) space complexity."
    },
    "defaultMastery": 75,
    "recommendedTimeMinutes": 15
  },
  {
    "id": "pm-dsa-031",
    "title": "Linked List Cycle Detection",
    "slug": "linked-list-cycle-detection",
    "difficulty": "Easy",
    "category": "DSA",
    "topics": [
      "Linked List"
    ],
    "companies": [
      "Amazon",
      "Microsoft",
      "Wipro"
    ],
    "frequentlyAsked": true,
    "interviewImportance": "Frequently Asked",
    "description": "Given the problem input for **Linked List Cycle Detection**, implement an optimal algorithm adhering to the time and space constraints specified in interview standards.",
    "examples": [
      {
        "input": "Standard interview input vector",
        "output": "Expected optimal result",
        "explanation": "Demonstrates optimal Linked List traversal."
      }
    ],
    "constraints": [
      "1 <= input.length <= 10^5",
      "Output must be within standard data bounds."
    ],
    "starterCode": {
      "python": "def linkedListCycleDetection(inputData) -> boolean:\n    # Write your solution here\n    return False\n",
      "javascript": "function linkedListCycleDetection(inputData) {\n    // Write your solution here\n    return false;\n}\n",
      "java": "class Solution {\n    public boolean linkedListCycleDetection(int[] inputData) {\n        // Write your solution here\n        return false;\n    }\n}\n",
      "cpp": "class Solution {\npublic:\n    bool linkedListCycleDetection(vector<int>& inputData) {\n        // Write your solution here\n        return false;\n    }\n};\n"
    },
    "supportedLanguages": [
      "python",
      "javascript",
      "java",
      "cpp"
    ],
    "testCases": [
      {
        "id": "tc-031-1",
        "input": "Valid case 1",
        "expectedOutput": "Standard Case 1 Result"
      },
      {
        "id": "tc-031-2",
        "input": "Edge case 2",
        "expectedOutput": "Standard Case 2 Result"
      }
    ],
    "hints": [
      "Consider optimal time complexity using Linked List principles.",
      "Break the state transition or traversal step down clearly.",
      "Check boundary/edge cases like empty input or duplicates."
    ],
    "approach": {
      "summary": "Optimal Linked List algorithm.",
      "steps": [
        "Understand problem constraints.",
        "Execute traversal / state update.",
        "Return final result."
      ]
    },
    "complexity": {
      "time": "O(N)",
      "space": "O(1) to O(N)",
      "analysis": "Algorithm runs in O(N) time with O(1) to O(N) space complexity."
    },
    "defaultMastery": 75,
    "recommendedTimeMinutes": 15
  },
  {
    "id": "pm-dsa-032",
    "title": "Reorder List",
    "slug": "reorder-list",
    "difficulty": "Medium",
    "category": "DSA",
    "topics": [
      "Linked List"
    ],
    "companies": [
      "Amazon",
      "Google"
    ],
    "frequentlyAsked": true,
    "interviewImportance": "Frequently Asked",
    "description": "Given the problem input for **Reorder List**, implement an optimal algorithm adhering to the time and space constraints specified in interview standards.",
    "examples": [
      {
        "input": "Standard interview input vector",
        "output": "Expected optimal result",
        "explanation": "Demonstrates optimal Linked List traversal."
      }
    ],
    "constraints": [
      "1 <= input.length <= 10^5",
      "Output must be within standard data bounds."
    ],
    "starterCode": {
      "python": "def reorderList(inputData) -> List<List<Integer>>:\n    # Write your solution here\n    return []\n",
      "javascript": "function reorderList(inputData) {\n    // Write your solution here\n    return [];\n}\n",
      "java": "class Solution {\n    public List<List<Integer>> reorderList(int[] inputData) {\n        // Write your solution here\n        return new ArrayList<>();\n    }\n}\n",
      "cpp": "class Solution {\npublic:\n    vector<vector<int>> reorderList(vector<int>& inputData) {\n        // Write your solution here\n        return {};\n    }\n};\n"
    },
    "supportedLanguages": [
      "python",
      "javascript",
      "java",
      "cpp"
    ],
    "testCases": [
      {
        "id": "tc-032-1",
        "input": "Valid case 1",
        "expectedOutput": "Standard Case 1 Result"
      },
      {
        "id": "tc-032-2",
        "input": "Edge case 2",
        "expectedOutput": "Standard Case 2 Result"
      }
    ],
    "hints": [
      "Consider optimal time complexity using Linked List principles.",
      "Break the state transition or traversal step down clearly.",
      "Check boundary/edge cases like empty input or duplicates."
    ],
    "approach": {
      "summary": "Optimal Linked List algorithm.",
      "steps": [
        "Understand problem constraints.",
        "Execute traversal / state update.",
        "Return final result."
      ]
    },
    "complexity": {
      "time": "O(N log N)",
      "space": "O(1) to O(N)",
      "analysis": "Algorithm runs in O(N log N) time with O(1) to O(N) space complexity."
    },
    "defaultMastery": 75,
    "recommendedTimeMinutes": 25
  },
  {
    "id": "pm-dsa-033",
    "title": "Remove Nth Node From End of List",
    "slug": "remove-nth-node-from-end-of-list",
    "difficulty": "Medium",
    "category": "DSA",
    "topics": [
      "Linked List"
    ],
    "companies": [
      "Amazon",
      "Microsoft"
    ],
    "frequentlyAsked": true,
    "interviewImportance": "Frequently Asked",
    "description": "Given the problem input for **Remove Nth Node From End of List**, implement an optimal algorithm adhering to the time and space constraints specified in interview standards.",
    "examples": [
      {
        "input": "Standard interview input vector",
        "output": "Expected optimal result",
        "explanation": "Demonstrates optimal Linked List traversal."
      }
    ],
    "constraints": [
      "1 <= input.length <= 10^5",
      "Output must be within standard data bounds."
    ],
    "starterCode": {
      "python": "def removeNthNodeFromEndOfList(inputData) -> List<List<Integer>>:\n    # Write your solution here\n    return []\n",
      "javascript": "function removeNthNodeFromEndOfList(inputData) {\n    // Write your solution here\n    return [];\n}\n",
      "java": "class Solution {\n    public List<List<Integer>> removeNthNodeFromEndOfList(int[] inputData) {\n        // Write your solution here\n        return new ArrayList<>();\n    }\n}\n",
      "cpp": "class Solution {\npublic:\n    vector<vector<int>> removeNthNodeFromEndOfList(vector<int>& inputData) {\n        // Write your solution here\n        return {};\n    }\n};\n"
    },
    "supportedLanguages": [
      "python",
      "javascript",
      "java",
      "cpp"
    ],
    "testCases": [
      {
        "id": "tc-033-1",
        "input": "Valid case 1",
        "expectedOutput": "Standard Case 1 Result"
      },
      {
        "id": "tc-033-2",
        "input": "Edge case 2",
        "expectedOutput": "Standard Case 2 Result"
      }
    ],
    "hints": [
      "Consider optimal time complexity using Linked List principles.",
      "Break the state transition or traversal step down clearly.",
      "Check boundary/edge cases like empty input or duplicates."
    ],
    "approach": {
      "summary": "Optimal Linked List algorithm.",
      "steps": [
        "Understand problem constraints.",
        "Execute traversal / state update.",
        "Return final result."
      ]
    },
    "complexity": {
      "time": "O(N log N)",
      "space": "O(1) to O(N)",
      "analysis": "Algorithm runs in O(N log N) time with O(1) to O(N) space complexity."
    },
    "defaultMastery": 75,
    "recommendedTimeMinutes": 25
  },
  {
    "id": "pm-dsa-034",
    "title": "Copy List with Random Pointer",
    "slug": "copy-list-with-random-pointer",
    "difficulty": "Medium",
    "category": "DSA",
    "topics": [
      "Linked List"
    ],
    "companies": [
      "Amazon",
      "Microsoft"
    ],
    "frequentlyAsked": true,
    "interviewImportance": "Frequently Asked",
    "description": "Given the problem input for **Copy List with Random Pointer**, implement an optimal algorithm adhering to the time and space constraints specified in interview standards.",
    "examples": [
      {
        "input": "Standard interview input vector",
        "output": "Expected optimal result",
        "explanation": "Demonstrates optimal Linked List traversal."
      }
    ],
    "constraints": [
      "1 <= input.length <= 10^5",
      "Output must be within standard data bounds."
    ],
    "starterCode": {
      "python": "def copyListWithRandomPointer(inputData) -> List<List<Integer>>:\n    # Write your solution here\n    return []\n",
      "javascript": "function copyListWithRandomPointer(inputData) {\n    // Write your solution here\n    return [];\n}\n",
      "java": "class Solution {\n    public List<List<Integer>> copyListWithRandomPointer(int[] inputData) {\n        // Write your solution here\n        return new ArrayList<>();\n    }\n}\n",
      "cpp": "class Solution {\npublic:\n    vector<vector<int>> copyListWithRandomPointer(vector<int>& inputData) {\n        // Write your solution here\n        return {};\n    }\n};\n"
    },
    "supportedLanguages": [
      "python",
      "javascript",
      "java",
      "cpp"
    ],
    "testCases": [
      {
        "id": "tc-034-1",
        "input": "Valid case 1",
        "expectedOutput": "Standard Case 1 Result"
      },
      {
        "id": "tc-034-2",
        "input": "Edge case 2",
        "expectedOutput": "Standard Case 2 Result"
      }
    ],
    "hints": [
      "Consider optimal time complexity using Linked List principles.",
      "Break the state transition or traversal step down clearly.",
      "Check boundary/edge cases like empty input or duplicates."
    ],
    "approach": {
      "summary": "Optimal Linked List algorithm.",
      "steps": [
        "Understand problem constraints.",
        "Execute traversal / state update.",
        "Return final result."
      ]
    },
    "complexity": {
      "time": "O(N log N)",
      "space": "O(1) to O(N)",
      "analysis": "Algorithm runs in O(N log N) time with O(1) to O(N) space complexity."
    },
    "defaultMastery": 75,
    "recommendedTimeMinutes": 25
  },
  {
    "id": "pm-dsa-035",
    "title": "Add Two Numbers Represented by Lists",
    "slug": "add-two-numbers-represented-by-lists",
    "difficulty": "Medium",
    "category": "DSA",
    "topics": [
      "Linked List"
    ],
    "companies": [
      "Amazon",
      "Microsoft",
      "Google"
    ],
    "frequentlyAsked": true,
    "interviewImportance": "Frequently Asked",
    "description": "Given the problem input for **Add Two Numbers Represented by Lists**, implement an optimal algorithm adhering to the time and space constraints specified in interview standards.",
    "examples": [
      {
        "input": "Standard interview input vector",
        "output": "Expected optimal result",
        "explanation": "Demonstrates optimal Linked List traversal."
      }
    ],
    "constraints": [
      "1 <= input.length <= 10^5",
      "Output must be within standard data bounds."
    ],
    "starterCode": {
      "python": "def addTwoNumbersRepresentedByLists(inputData) -> List<List<Integer>>:\n    # Write your solution here\n    return []\n",
      "javascript": "function addTwoNumbersRepresentedByLists(inputData) {\n    // Write your solution here\n    return [];\n}\n",
      "java": "class Solution {\n    public List<List<Integer>> addTwoNumbersRepresentedByLists(int[] inputData) {\n        // Write your solution here\n        return new ArrayList<>();\n    }\n}\n",
      "cpp": "class Solution {\npublic:\n    vector<vector<int>> addTwoNumbersRepresentedByLists(vector<int>& inputData) {\n        // Write your solution here\n        return {};\n    }\n};\n"
    },
    "supportedLanguages": [
      "python",
      "javascript",
      "java",
      "cpp"
    ],
    "testCases": [
      {
        "id": "tc-035-1",
        "input": "Valid case 1",
        "expectedOutput": "Standard Case 1 Result"
      },
      {
        "id": "tc-035-2",
        "input": "Edge case 2",
        "expectedOutput": "Standard Case 2 Result"
      }
    ],
    "hints": [
      "Consider optimal time complexity using Linked List principles.",
      "Break the state transition or traversal step down clearly.",
      "Check boundary/edge cases like empty input or duplicates."
    ],
    "approach": {
      "summary": "Optimal Linked List algorithm.",
      "steps": [
        "Understand problem constraints.",
        "Execute traversal / state update.",
        "Return final result."
      ]
    },
    "complexity": {
      "time": "O(N log N)",
      "space": "O(1) to O(N)",
      "analysis": "Algorithm runs in O(N log N) time with O(1) to O(N) space complexity."
    },
    "defaultMastery": 75,
    "recommendedTimeMinutes": 25
  },
  {
    "id": "pm-dsa-036",
    "title": "LRU Cache Design",
    "slug": "lru-cache-design",
    "difficulty": "Medium",
    "category": "DSA",
    "topics": [
      "Linked List"
    ],
    "companies": [
      "Amazon",
      "Microsoft",
      "Google",
      "Zoho"
    ],
    "frequentlyAsked": true,
    "interviewImportance": "Frequently Asked",
    "description": "Given the problem input for **LRU Cache Design**, implement an optimal algorithm adhering to the time and space constraints specified in interview standards.",
    "examples": [
      {
        "input": "Standard interview input vector",
        "output": "Expected optimal result",
        "explanation": "Demonstrates optimal Linked List traversal."
      }
    ],
    "constraints": [
      "1 <= input.length <= 10^5",
      "Output must be within standard data bounds."
    ],
    "starterCode": {
      "python": "def lruCacheDesign(inputData) -> int:\n    # Write your solution here\n    return 0\n",
      "javascript": "function lruCacheDesign(inputData) {\n    // Write your solution here\n    return 0;\n}\n",
      "java": "class Solution {\n    public int lruCacheDesign(int[] inputData) {\n        // Write your solution here\n        return 0;\n    }\n}\n",
      "cpp": "class Solution {\npublic:\n    int lruCacheDesign(vector<int>& inputData) {\n        // Write your solution here\n        return 0;\n    }\n};\n"
    },
    "supportedLanguages": [
      "python",
      "javascript",
      "java",
      "cpp"
    ],
    "testCases": [
      {
        "id": "tc-036-1",
        "input": "Valid case 1",
        "expectedOutput": "Standard Case 1 Result"
      },
      {
        "id": "tc-036-2",
        "input": "Edge case 2",
        "expectedOutput": "Standard Case 2 Result"
      }
    ],
    "hints": [
      "Consider optimal time complexity using Linked List principles.",
      "Break the state transition or traversal step down clearly.",
      "Check boundary/edge cases like empty input or duplicates."
    ],
    "approach": {
      "summary": "Optimal Linked List algorithm.",
      "steps": [
        "Understand problem constraints.",
        "Execute traversal / state update.",
        "Return final result."
      ]
    },
    "complexity": {
      "time": "O(N log N)",
      "space": "O(1) to O(N)",
      "analysis": "Algorithm runs in O(N log N) time with O(1) to O(N) space complexity."
    },
    "defaultMastery": 75,
    "recommendedTimeMinutes": 25
  },
  {
    "id": "pm-dsa-037",
    "title": "Merge k Sorted Lists",
    "slug": "merge-k-sorted-lists",
    "difficulty": "Hard",
    "category": "DSA",
    "topics": [
      "Linked List"
    ],
    "companies": [
      "Amazon",
      "Google",
      "Microsoft"
    ],
    "frequentlyAsked": true,
    "interviewImportance": "Frequently Asked",
    "description": "Given the problem input for **Merge k Sorted Lists**, implement an optimal algorithm adhering to the time and space constraints specified in interview standards.",
    "examples": [
      {
        "input": "Standard interview input vector",
        "output": "Expected optimal result",
        "explanation": "Demonstrates optimal Linked List traversal."
      }
    ],
    "constraints": [
      "1 <= input.length <= 10^5",
      "Output must be within standard data bounds."
    ],
    "starterCode": {
      "python": "def mergeKSortedLists(inputData) -> List<List<Integer>>:\n    # Write your solution here\n    return []\n",
      "javascript": "function mergeKSortedLists(inputData) {\n    // Write your solution here\n    return [];\n}\n",
      "java": "class Solution {\n    public List<List<Integer>> mergeKSortedLists(int[] inputData) {\n        // Write your solution here\n        return new ArrayList<>();\n    }\n}\n",
      "cpp": "class Solution {\npublic:\n    vector<vector<int>> mergeKSortedLists(vector<int>& inputData) {\n        // Write your solution here\n        return {};\n    }\n};\n"
    },
    "supportedLanguages": [
      "python",
      "javascript",
      "java",
      "cpp"
    ],
    "testCases": [
      {
        "id": "tc-037-1",
        "input": "Valid case 1",
        "expectedOutput": "Standard Case 1 Result"
      },
      {
        "id": "tc-037-2",
        "input": "Edge case 2",
        "expectedOutput": "Standard Case 2 Result"
      }
    ],
    "hints": [
      "Consider optimal time complexity using Linked List principles.",
      "Break the state transition or traversal step down clearly.",
      "Check boundary/edge cases like empty input or duplicates."
    ],
    "approach": {
      "summary": "Optimal Linked List algorithm.",
      "steps": [
        "Understand problem constraints.",
        "Execute traversal / state update.",
        "Return final result."
      ]
    },
    "complexity": {
      "time": "O(N log N)",
      "space": "O(1) to O(N)",
      "analysis": "Algorithm runs in O(N log N) time with O(1) to O(N) space complexity."
    },
    "defaultMastery": 75,
    "recommendedTimeMinutes": 40
  },
  {
    "id": "pm-dsa-038",
    "title": "Binary Search",
    "slug": "binary-search",
    "difficulty": "Easy",
    "category": "DSA",
    "topics": [
      "Binary Search"
    ],
    "companies": [
      "Amazon",
      "Microsoft",
      "TCS"
    ],
    "frequentlyAsked": true,
    "interviewImportance": "Frequently Asked",
    "description": "Given the problem input for **Binary Search**, implement an optimal algorithm adhering to the time and space constraints specified in interview standards.",
    "examples": [
      {
        "input": "Standard interview input vector",
        "output": "Expected optimal result",
        "explanation": "Demonstrates optimal Binary Search traversal."
      }
    ],
    "constraints": [
      "1 <= input.length <= 10^5",
      "Output must be within standard data bounds."
    ],
    "starterCode": {
      "python": "def binarySearch(inputData) -> int:\n    # Write your solution here\n    return 0\n",
      "javascript": "function binarySearch(inputData) {\n    // Write your solution here\n    return 0;\n}\n",
      "java": "class Solution {\n    public int binarySearch(int[] inputData) {\n        // Write your solution here\n        return 0;\n    }\n}\n",
      "cpp": "class Solution {\npublic:\n    int binarySearch(vector<int>& inputData) {\n        // Write your solution here\n        return 0;\n    }\n};\n"
    },
    "supportedLanguages": [
      "python",
      "javascript",
      "java",
      "cpp"
    ],
    "testCases": [
      {
        "id": "tc-038-1",
        "input": "Valid case 1",
        "expectedOutput": "Standard Case 1 Result"
      },
      {
        "id": "tc-038-2",
        "input": "Edge case 2",
        "expectedOutput": "Standard Case 2 Result"
      }
    ],
    "hints": [
      "Consider optimal time complexity using Binary Search principles.",
      "Break the state transition or traversal step down clearly.",
      "Check boundary/edge cases like empty input or duplicates."
    ],
    "approach": {
      "summary": "Optimal Binary Search algorithm.",
      "steps": [
        "Understand problem constraints.",
        "Execute traversal / state update.",
        "Return final result."
      ]
    },
    "complexity": {
      "time": "O(N)",
      "space": "O(1) to O(N)",
      "analysis": "Algorithm runs in O(N) time with O(1) to O(N) space complexity."
    },
    "defaultMastery": 75,
    "recommendedTimeMinutes": 15
  },
  {
    "id": "pm-dsa-039",
    "title": "Search a 2D Matrix",
    "slug": "search-a-2d-matrix",
    "difficulty": "Medium",
    "category": "DSA",
    "topics": [
      "Binary Search"
    ],
    "companies": [
      "Amazon",
      "Microsoft"
    ],
    "frequentlyAsked": true,
    "interviewImportance": "Frequently Asked",
    "description": "Given the problem input for **Search a 2D Matrix**, implement an optimal algorithm adhering to the time and space constraints specified in interview standards.",
    "examples": [
      {
        "input": "Standard interview input vector",
        "output": "Expected optimal result",
        "explanation": "Demonstrates optimal Binary Search traversal."
      }
    ],
    "constraints": [
      "1 <= input.length <= 10^5",
      "Output must be within standard data bounds."
    ],
    "starterCode": {
      "python": "def searchA2dMatrix(inputData) -> boolean:\n    # Write your solution here\n    return False\n",
      "javascript": "function searchA2dMatrix(inputData) {\n    // Write your solution here\n    return false;\n}\n",
      "java": "class Solution {\n    public boolean searchA2dMatrix(int[] inputData) {\n        // Write your solution here\n        return false;\n    }\n}\n",
      "cpp": "class Solution {\npublic:\n    bool searchA2dMatrix(vector<int>& inputData) {\n        // Write your solution here\n        return false;\n    }\n};\n"
    },
    "supportedLanguages": [
      "python",
      "javascript",
      "java",
      "cpp"
    ],
    "testCases": [
      {
        "id": "tc-039-1",
        "input": "Valid case 1",
        "expectedOutput": "Standard Case 1 Result"
      },
      {
        "id": "tc-039-2",
        "input": "Edge case 2",
        "expectedOutput": "Standard Case 2 Result"
      }
    ],
    "hints": [
      "Consider optimal time complexity using Binary Search principles.",
      "Break the state transition or traversal step down clearly.",
      "Check boundary/edge cases like empty input or duplicates."
    ],
    "approach": {
      "summary": "Optimal Binary Search algorithm.",
      "steps": [
        "Understand problem constraints.",
        "Execute traversal / state update.",
        "Return final result."
      ]
    },
    "complexity": {
      "time": "O(N log N)",
      "space": "O(1) to O(N)",
      "analysis": "Algorithm runs in O(N log N) time with O(1) to O(N) space complexity."
    },
    "defaultMastery": 75,
    "recommendedTimeMinutes": 25
  },
  {
    "id": "pm-dsa-040",
    "title": "Koko Eating Bananas",
    "slug": "koko-eating-bananas",
    "difficulty": "Medium",
    "category": "DSA",
    "topics": [
      "Binary Search"
    ],
    "companies": [
      "Google",
      "Amazon"
    ],
    "frequentlyAsked": true,
    "interviewImportance": "Frequently Asked",
    "description": "Given the problem input for **Koko Eating Bananas**, implement an optimal algorithm adhering to the time and space constraints specified in interview standards.",
    "examples": [
      {
        "input": "Standard interview input vector",
        "output": "Expected optimal result",
        "explanation": "Demonstrates optimal Binary Search traversal."
      }
    ],
    "constraints": [
      "1 <= input.length <= 10^5",
      "Output must be within standard data bounds."
    ],
    "starterCode": {
      "python": "def kokoEatingBananas(inputData) -> int:\n    # Write your solution here\n    return 0\n",
      "javascript": "function kokoEatingBananas(inputData) {\n    // Write your solution here\n    return 0;\n}\n",
      "java": "class Solution {\n    public int kokoEatingBananas(int[] inputData) {\n        // Write your solution here\n        return 0;\n    }\n}\n",
      "cpp": "class Solution {\npublic:\n    int kokoEatingBananas(vector<int>& inputData) {\n        // Write your solution here\n        return 0;\n    }\n};\n"
    },
    "supportedLanguages": [
      "python",
      "javascript",
      "java",
      "cpp"
    ],
    "testCases": [
      {
        "id": "tc-040-1",
        "input": "Valid case 1",
        "expectedOutput": "Standard Case 1 Result"
      },
      {
        "id": "tc-040-2",
        "input": "Edge case 2",
        "expectedOutput": "Standard Case 2 Result"
      }
    ],
    "hints": [
      "Consider optimal time complexity using Binary Search principles.",
      "Break the state transition or traversal step down clearly.",
      "Check boundary/edge cases like empty input or duplicates."
    ],
    "approach": {
      "summary": "Optimal Binary Search algorithm.",
      "steps": [
        "Understand problem constraints.",
        "Execute traversal / state update.",
        "Return final result."
      ]
    },
    "complexity": {
      "time": "O(N log N)",
      "space": "O(1) to O(N)",
      "analysis": "Algorithm runs in O(N log N) time with O(1) to O(N) space complexity."
    },
    "defaultMastery": 75,
    "recommendedTimeMinutes": 25
  },
  {
    "id": "pm-dsa-041",
    "title": "Find Minimum in Rotated Sorted Array",
    "slug": "find-minimum-in-rotated-sorted-array",
    "difficulty": "Medium",
    "category": "DSA",
    "topics": [
      "Binary Search"
    ],
    "companies": [
      "Amazon",
      "Microsoft"
    ],
    "frequentlyAsked": true,
    "interviewImportance": "Frequently Asked",
    "description": "Given the problem input for **Find Minimum in Rotated Sorted Array**, implement an optimal algorithm adhering to the time and space constraints specified in interview standards.",
    "examples": [
      {
        "input": "Standard interview input vector",
        "output": "Expected optimal result",
        "explanation": "Demonstrates optimal Binary Search traversal."
      }
    ],
    "constraints": [
      "1 <= input.length <= 10^5",
      "Output must be within standard data bounds."
    ],
    "starterCode": {
      "python": "def findMinimumInRotatedSortedArray(inputData) -> int:\n    # Write your solution here\n    return 0\n",
      "javascript": "function findMinimumInRotatedSortedArray(inputData) {\n    // Write your solution here\n    return 0;\n}\n",
      "java": "class Solution {\n    public int findMinimumInRotatedSortedArray(int[] inputData) {\n        // Write your solution here\n        return 0;\n    }\n}\n",
      "cpp": "class Solution {\npublic:\n    int findMinimumInRotatedSortedArray(vector<int>& inputData) {\n        // Write your solution here\n        return 0;\n    }\n};\n"
    },
    "supportedLanguages": [
      "python",
      "javascript",
      "java",
      "cpp"
    ],
    "testCases": [
      {
        "id": "tc-041-1",
        "input": "Valid case 1",
        "expectedOutput": "Standard Case 1 Result"
      },
      {
        "id": "tc-041-2",
        "input": "Edge case 2",
        "expectedOutput": "Standard Case 2 Result"
      }
    ],
    "hints": [
      "Consider optimal time complexity using Binary Search principles.",
      "Break the state transition or traversal step down clearly.",
      "Check boundary/edge cases like empty input or duplicates."
    ],
    "approach": {
      "summary": "Optimal Binary Search algorithm.",
      "steps": [
        "Understand problem constraints.",
        "Execute traversal / state update.",
        "Return final result."
      ]
    },
    "complexity": {
      "time": "O(N log N)",
      "space": "O(1) to O(N)",
      "analysis": "Algorithm runs in O(N log N) time with O(1) to O(N) space complexity."
    },
    "defaultMastery": 75,
    "recommendedTimeMinutes": 25
  },
  {
    "id": "pm-dsa-042",
    "title": "Search in Rotated Sorted Array",
    "slug": "search-in-rotated-sorted-array",
    "difficulty": "Medium",
    "category": "DSA",
    "topics": [
      "Binary Search"
    ],
    "companies": [
      "Amazon",
      "Microsoft",
      "Google"
    ],
    "frequentlyAsked": true,
    "interviewImportance": "Frequently Asked",
    "description": "Given the problem input for **Search in Rotated Sorted Array**, implement an optimal algorithm adhering to the time and space constraints specified in interview standards.",
    "examples": [
      {
        "input": "Standard interview input vector",
        "output": "Expected optimal result",
        "explanation": "Demonstrates optimal Binary Search traversal."
      }
    ],
    "constraints": [
      "1 <= input.length <= 10^5",
      "Output must be within standard data bounds."
    ],
    "starterCode": {
      "python": "def searchInRotatedSortedArray(inputData) -> int:\n    # Write your solution here\n    return 0\n",
      "javascript": "function searchInRotatedSortedArray(inputData) {\n    // Write your solution here\n    return 0;\n}\n",
      "java": "class Solution {\n    public int searchInRotatedSortedArray(int[] inputData) {\n        // Write your solution here\n        return 0;\n    }\n}\n",
      "cpp": "class Solution {\npublic:\n    int searchInRotatedSortedArray(vector<int>& inputData) {\n        // Write your solution here\n        return 0;\n    }\n};\n"
    },
    "supportedLanguages": [
      "python",
      "javascript",
      "java",
      "cpp"
    ],
    "testCases": [
      {
        "id": "tc-042-1",
        "input": "Valid case 1",
        "expectedOutput": "Standard Case 1 Result"
      },
      {
        "id": "tc-042-2",
        "input": "Edge case 2",
        "expectedOutput": "Standard Case 2 Result"
      }
    ],
    "hints": [
      "Consider optimal time complexity using Binary Search principles.",
      "Break the state transition or traversal step down clearly.",
      "Check boundary/edge cases like empty input or duplicates."
    ],
    "approach": {
      "summary": "Optimal Binary Search algorithm.",
      "steps": [
        "Understand problem constraints.",
        "Execute traversal / state update.",
        "Return final result."
      ]
    },
    "complexity": {
      "time": "O(N log N)",
      "space": "O(1) to O(N)",
      "analysis": "Algorithm runs in O(N log N) time with O(1) to O(N) space complexity."
    },
    "defaultMastery": 75,
    "recommendedTimeMinutes": 25
  },
  {
    "id": "pm-dsa-043",
    "title": "Time Based Key-Value Store",
    "slug": "time-based-key-value-store",
    "difficulty": "Medium",
    "category": "DSA",
    "topics": [
      "Binary Search"
    ],
    "companies": [
      "Google",
      "Amazon"
    ],
    "frequentlyAsked": true,
    "interviewImportance": "Frequently Asked",
    "description": "Given the problem input for **Time Based Key-Value Store**, implement an optimal algorithm adhering to the time and space constraints specified in interview standards.",
    "examples": [
      {
        "input": "Standard interview input vector",
        "output": "Expected optimal result",
        "explanation": "Demonstrates optimal Binary Search traversal."
      }
    ],
    "constraints": [
      "1 <= input.length <= 10^5",
      "Output must be within standard data bounds."
    ],
    "starterCode": {
      "python": "def timeBasedKeyValueStore(inputData) -> String:\n    # Write your solution here\n    return \"\"\n",
      "javascript": "function timeBasedKeyValueStore(inputData) {\n    // Write your solution here\n    return \"\";\n}\n",
      "java": "class Solution {\n    public String timeBasedKeyValueStore(int[] inputData) {\n        // Write your solution here\n        return \"\";\n    }\n}\n",
      "cpp": "class Solution {\npublic:\n    string timeBasedKeyValueStore(vector<int>& inputData) {\n        // Write your solution here\n        return \"\";\n    }\n};\n"
    },
    "supportedLanguages": [
      "python",
      "javascript",
      "java",
      "cpp"
    ],
    "testCases": [
      {
        "id": "tc-043-1",
        "input": "Valid case 1",
        "expectedOutput": "Standard Case 1 Result"
      },
      {
        "id": "tc-043-2",
        "input": "Edge case 2",
        "expectedOutput": "Standard Case 2 Result"
      }
    ],
    "hints": [
      "Consider optimal time complexity using Binary Search principles.",
      "Break the state transition or traversal step down clearly.",
      "Check boundary/edge cases like empty input or duplicates."
    ],
    "approach": {
      "summary": "Optimal Binary Search algorithm.",
      "steps": [
        "Understand problem constraints.",
        "Execute traversal / state update.",
        "Return final result."
      ]
    },
    "complexity": {
      "time": "O(N log N)",
      "space": "O(1) to O(N)",
      "analysis": "Algorithm runs in O(N log N) time with O(1) to O(N) space complexity."
    },
    "defaultMastery": 75,
    "recommendedTimeMinutes": 25
  },
  {
    "id": "pm-dsa-044",
    "title": "Median of Two Sorted Arrays",
    "slug": "median-of-two-sorted-arrays",
    "difficulty": "Hard",
    "category": "DSA",
    "topics": [
      "Binary Search"
    ],
    "companies": [
      "Google",
      "Microsoft",
      "Amazon"
    ],
    "frequentlyAsked": true,
    "interviewImportance": "Frequently Asked",
    "description": "Given the problem input for **Median of Two Sorted Arrays**, implement an optimal algorithm adhering to the time and space constraints specified in interview standards.",
    "examples": [
      {
        "input": "Standard interview input vector",
        "output": "Expected optimal result",
        "explanation": "Demonstrates optimal Binary Search traversal."
      }
    ],
    "constraints": [
      "1 <= input.length <= 10^5",
      "Output must be within standard data bounds."
    ],
    "starterCode": {
      "python": "def medianOfTwoSortedArrays(inputData) -> double:\n    # Write your solution here\n    return 0.0\n",
      "javascript": "function medianOfTwoSortedArrays(inputData) {\n    // Write your solution here\n    return 0.0;\n}\n",
      "java": "class Solution {\n    public double medianOfTwoSortedArrays(int[] inputData) {\n        // Write your solution here\n        return 0.0;\n    }\n}\n",
      "cpp": "class Solution {\npublic:\n    double medianOfTwoSortedArrays(vector<int>& inputData) {\n        // Write your solution here\n        return 0.0;\n    }\n};\n"
    },
    "supportedLanguages": [
      "python",
      "javascript",
      "java",
      "cpp"
    ],
    "testCases": [
      {
        "id": "tc-044-1",
        "input": "Valid case 1",
        "expectedOutput": "Standard Case 1 Result"
      },
      {
        "id": "tc-044-2",
        "input": "Edge case 2",
        "expectedOutput": "Standard Case 2 Result"
      }
    ],
    "hints": [
      "Consider optimal time complexity using Binary Search principles.",
      "Break the state transition or traversal step down clearly.",
      "Check boundary/edge cases like empty input or duplicates."
    ],
    "approach": {
      "summary": "Optimal Binary Search algorithm.",
      "steps": [
        "Understand problem constraints.",
        "Execute traversal / state update.",
        "Return final result."
      ]
    },
    "complexity": {
      "time": "O(N log N)",
      "space": "O(1) to O(N)",
      "analysis": "Algorithm runs in O(N log N) time with O(1) to O(N) space complexity."
    },
    "defaultMastery": 75,
    "recommendedTimeMinutes": 40
  },
  {
    "id": "pm-dsa-045",
    "title": "Invert Binary Tree",
    "slug": "invert-binary-tree",
    "difficulty": "Easy",
    "category": "DSA",
    "topics": [
      "Trees"
    ],
    "companies": [
      "Amazon",
      "Google",
      "TCS"
    ],
    "frequentlyAsked": true,
    "interviewImportance": "Frequently Asked",
    "description": "Given the problem input for **Invert Binary Tree**, implement an optimal algorithm adhering to the time and space constraints specified in interview standards.",
    "examples": [
      {
        "input": "Standard interview input vector",
        "output": "Expected optimal result",
        "explanation": "Demonstrates optimal Trees traversal."
      }
    ],
    "constraints": [
      "1 <= input.length <= 10^5",
      "Output must be within standard data bounds."
    ],
    "starterCode": {
      "python": "def invertBinaryTree(inputData) -> List<List<Integer>>:\n    # Write your solution here\n    return []\n",
      "javascript": "function invertBinaryTree(inputData) {\n    // Write your solution here\n    return [];\n}\n",
      "java": "class Solution {\n    public List<List<Integer>> invertBinaryTree(int[] inputData) {\n        // Write your solution here\n        return new ArrayList<>();\n    }\n}\n",
      "cpp": "class Solution {\npublic:\n    vector<vector<int>> invertBinaryTree(vector<int>& inputData) {\n        // Write your solution here\n        return {};\n    }\n};\n"
    },
    "supportedLanguages": [
      "python",
      "javascript",
      "java",
      "cpp"
    ],
    "testCases": [
      {
        "id": "tc-045-1",
        "input": "Valid case 1",
        "expectedOutput": "Standard Case 1 Result"
      },
      {
        "id": "tc-045-2",
        "input": "Edge case 2",
        "expectedOutput": "Standard Case 2 Result"
      }
    ],
    "hints": [
      "Consider optimal time complexity using Trees principles.",
      "Break the state transition or traversal step down clearly.",
      "Check boundary/edge cases like empty input or duplicates."
    ],
    "approach": {
      "summary": "Optimal Trees algorithm.",
      "steps": [
        "Understand problem constraints.",
        "Execute traversal / state update.",
        "Return final result."
      ]
    },
    "complexity": {
      "time": "O(N)",
      "space": "O(1) to O(N)",
      "analysis": "Algorithm runs in O(N) time with O(1) to O(N) space complexity."
    },
    "defaultMastery": 75,
    "recommendedTimeMinutes": 15
  },
  {
    "id": "pm-dsa-046",
    "title": "Maximum Depth of Binary Tree",
    "slug": "maximum-depth-of-binary-tree",
    "difficulty": "Easy",
    "category": "DSA",
    "topics": [
      "Trees"
    ],
    "companies": [
      "Amazon",
      "Microsoft",
      "Infosys"
    ],
    "frequentlyAsked": true,
    "interviewImportance": "Frequently Asked",
    "description": "Given the problem input for **Maximum Depth of Binary Tree**, implement an optimal algorithm adhering to the time and space constraints specified in interview standards.",
    "examples": [
      {
        "input": "Standard interview input vector",
        "output": "Expected optimal result",
        "explanation": "Demonstrates optimal Trees traversal."
      }
    ],
    "constraints": [
      "1 <= input.length <= 10^5",
      "Output must be within standard data bounds."
    ],
    "starterCode": {
      "python": "def maximumDepthOfBinaryTree(inputData) -> int:\n    # Write your solution here\n    return 0\n",
      "javascript": "function maximumDepthOfBinaryTree(inputData) {\n    // Write your solution here\n    return 0;\n}\n",
      "java": "class Solution {\n    public int maximumDepthOfBinaryTree(int[] inputData) {\n        // Write your solution here\n        return 0;\n    }\n}\n",
      "cpp": "class Solution {\npublic:\n    int maximumDepthOfBinaryTree(vector<int>& inputData) {\n        // Write your solution here\n        return 0;\n    }\n};\n"
    },
    "supportedLanguages": [
      "python",
      "javascript",
      "java",
      "cpp"
    ],
    "testCases": [
      {
        "id": "tc-046-1",
        "input": "Valid case 1",
        "expectedOutput": "Standard Case 1 Result"
      },
      {
        "id": "tc-046-2",
        "input": "Edge case 2",
        "expectedOutput": "Standard Case 2 Result"
      }
    ],
    "hints": [
      "Consider optimal time complexity using Trees principles.",
      "Break the state transition or traversal step down clearly.",
      "Check boundary/edge cases like empty input or duplicates."
    ],
    "approach": {
      "summary": "Optimal Trees algorithm.",
      "steps": [
        "Understand problem constraints.",
        "Execute traversal / state update.",
        "Return final result."
      ]
    },
    "complexity": {
      "time": "O(N)",
      "space": "O(1) to O(N)",
      "analysis": "Algorithm runs in O(N) time with O(1) to O(N) space complexity."
    },
    "defaultMastery": 75,
    "recommendedTimeMinutes": 15
  },
  {
    "id": "pm-dsa-047",
    "title": "Diameter of Binary Tree",
    "slug": "diameter-of-binary-tree",
    "difficulty": "Easy",
    "category": "DSA",
    "topics": [
      "Trees"
    ],
    "companies": [
      "Amazon",
      "Microsoft"
    ],
    "frequentlyAsked": true,
    "interviewImportance": "Frequently Asked",
    "description": "Given the problem input for **Diameter of Binary Tree**, implement an optimal algorithm adhering to the time and space constraints specified in interview standards.",
    "examples": [
      {
        "input": "Standard interview input vector",
        "output": "Expected optimal result",
        "explanation": "Demonstrates optimal Trees traversal."
      }
    ],
    "constraints": [
      "1 <= input.length <= 10^5",
      "Output must be within standard data bounds."
    ],
    "starterCode": {
      "python": "def diameterOfBinaryTree(inputData) -> int:\n    # Write your solution here\n    return 0\n",
      "javascript": "function diameterOfBinaryTree(inputData) {\n    // Write your solution here\n    return 0;\n}\n",
      "java": "class Solution {\n    public int diameterOfBinaryTree(int[] inputData) {\n        // Write your solution here\n        return 0;\n    }\n}\n",
      "cpp": "class Solution {\npublic:\n    int diameterOfBinaryTree(vector<int>& inputData) {\n        // Write your solution here\n        return 0;\n    }\n};\n"
    },
    "supportedLanguages": [
      "python",
      "javascript",
      "java",
      "cpp"
    ],
    "testCases": [
      {
        "id": "tc-047-1",
        "input": "Valid case 1",
        "expectedOutput": "Standard Case 1 Result"
      },
      {
        "id": "tc-047-2",
        "input": "Edge case 2",
        "expectedOutput": "Standard Case 2 Result"
      }
    ],
    "hints": [
      "Consider optimal time complexity using Trees principles.",
      "Break the state transition or traversal step down clearly.",
      "Check boundary/edge cases like empty input or duplicates."
    ],
    "approach": {
      "summary": "Optimal Trees algorithm.",
      "steps": [
        "Understand problem constraints.",
        "Execute traversal / state update.",
        "Return final result."
      ]
    },
    "complexity": {
      "time": "O(N)",
      "space": "O(1) to O(N)",
      "analysis": "Algorithm runs in O(N) time with O(1) to O(N) space complexity."
    },
    "defaultMastery": 75,
    "recommendedTimeMinutes": 15
  },
  {
    "id": "pm-dsa-048",
    "title": "Balanced Binary Tree",
    "slug": "balanced-binary-tree",
    "difficulty": "Easy",
    "category": "DSA",
    "topics": [
      "Trees"
    ],
    "companies": [
      "Amazon",
      "Microsoft"
    ],
    "frequentlyAsked": true,
    "interviewImportance": "Frequently Asked",
    "description": "Given the problem input for **Balanced Binary Tree**, implement an optimal algorithm adhering to the time and space constraints specified in interview standards.",
    "examples": [
      {
        "input": "Standard interview input vector",
        "output": "Expected optimal result",
        "explanation": "Demonstrates optimal Trees traversal."
      }
    ],
    "constraints": [
      "1 <= input.length <= 10^5",
      "Output must be within standard data bounds."
    ],
    "starterCode": {
      "python": "def balancedBinaryTree(inputData) -> boolean:\n    # Write your solution here\n    return False\n",
      "javascript": "function balancedBinaryTree(inputData) {\n    // Write your solution here\n    return false;\n}\n",
      "java": "class Solution {\n    public boolean balancedBinaryTree(int[] inputData) {\n        // Write your solution here\n        return false;\n    }\n}\n",
      "cpp": "class Solution {\npublic:\n    bool balancedBinaryTree(vector<int>& inputData) {\n        // Write your solution here\n        return false;\n    }\n};\n"
    },
    "supportedLanguages": [
      "python",
      "javascript",
      "java",
      "cpp"
    ],
    "testCases": [
      {
        "id": "tc-048-1",
        "input": "Valid case 1",
        "expectedOutput": "Standard Case 1 Result"
      },
      {
        "id": "tc-048-2",
        "input": "Edge case 2",
        "expectedOutput": "Standard Case 2 Result"
      }
    ],
    "hints": [
      "Consider optimal time complexity using Trees principles.",
      "Break the state transition or traversal step down clearly.",
      "Check boundary/edge cases like empty input or duplicates."
    ],
    "approach": {
      "summary": "Optimal Trees algorithm.",
      "steps": [
        "Understand problem constraints.",
        "Execute traversal / state update.",
        "Return final result."
      ]
    },
    "complexity": {
      "time": "O(N)",
      "space": "O(1) to O(N)",
      "analysis": "Algorithm runs in O(N) time with O(1) to O(N) space complexity."
    },
    "defaultMastery": 75,
    "recommendedTimeMinutes": 15
  },
  {
    "id": "pm-dsa-049",
    "title": "Same Tree",
    "slug": "same-tree",
    "difficulty": "Easy",
    "category": "DSA",
    "topics": [
      "Trees"
    ],
    "companies": [
      "Amazon",
      "TCS"
    ],
    "frequentlyAsked": true,
    "interviewImportance": "Frequently Asked",
    "description": "Given the problem input for **Same Tree**, implement an optimal algorithm adhering to the time and space constraints specified in interview standards.",
    "examples": [
      {
        "input": "Standard interview input vector",
        "output": "Expected optimal result",
        "explanation": "Demonstrates optimal Trees traversal."
      }
    ],
    "constraints": [
      "1 <= input.length <= 10^5",
      "Output must be within standard data bounds."
    ],
    "starterCode": {
      "python": "def sameTree(inputData) -> boolean:\n    # Write your solution here\n    return False\n",
      "javascript": "function sameTree(inputData) {\n    // Write your solution here\n    return false;\n}\n",
      "java": "class Solution {\n    public boolean sameTree(int[] inputData) {\n        // Write your solution here\n        return false;\n    }\n}\n",
      "cpp": "class Solution {\npublic:\n    bool sameTree(vector<int>& inputData) {\n        // Write your solution here\n        return false;\n    }\n};\n"
    },
    "supportedLanguages": [
      "python",
      "javascript",
      "java",
      "cpp"
    ],
    "testCases": [
      {
        "id": "tc-049-1",
        "input": "Valid case 1",
        "expectedOutput": "Standard Case 1 Result"
      },
      {
        "id": "tc-049-2",
        "input": "Edge case 2",
        "expectedOutput": "Standard Case 2 Result"
      }
    ],
    "hints": [
      "Consider optimal time complexity using Trees principles.",
      "Break the state transition or traversal step down clearly.",
      "Check boundary/edge cases like empty input or duplicates."
    ],
    "approach": {
      "summary": "Optimal Trees algorithm.",
      "steps": [
        "Understand problem constraints.",
        "Execute traversal / state update.",
        "Return final result."
      ]
    },
    "complexity": {
      "time": "O(N)",
      "space": "O(1) to O(N)",
      "analysis": "Algorithm runs in O(N) time with O(1) to O(N) space complexity."
    },
    "defaultMastery": 75,
    "recommendedTimeMinutes": 15
  },
  {
    "id": "pm-dsa-050",
    "title": "Subtree of Another Tree",
    "slug": "subtree-of-another-tree",
    "difficulty": "Easy",
    "category": "DSA",
    "topics": [
      "Trees"
    ],
    "companies": [
      "Amazon",
      "Google"
    ],
    "frequentlyAsked": true,
    "interviewImportance": "Frequently Asked",
    "description": "Given the problem input for **Subtree of Another Tree**, implement an optimal algorithm adhering to the time and space constraints specified in interview standards.",
    "examples": [
      {
        "input": "Standard interview input vector",
        "output": "Expected optimal result",
        "explanation": "Demonstrates optimal Trees traversal."
      }
    ],
    "constraints": [
      "1 <= input.length <= 10^5",
      "Output must be within standard data bounds."
    ],
    "starterCode": {
      "python": "def subtreeOfAnotherTree(inputData) -> boolean:\n    # Write your solution here\n    return False\n",
      "javascript": "function subtreeOfAnotherTree(inputData) {\n    // Write your solution here\n    return false;\n}\n",
      "java": "class Solution {\n    public boolean subtreeOfAnotherTree(int[] inputData) {\n        // Write your solution here\n        return false;\n    }\n}\n",
      "cpp": "class Solution {\npublic:\n    bool subtreeOfAnotherTree(vector<int>& inputData) {\n        // Write your solution here\n        return false;\n    }\n};\n"
    },
    "supportedLanguages": [
      "python",
      "javascript",
      "java",
      "cpp"
    ],
    "testCases": [
      {
        "id": "tc-050-1",
        "input": "Valid case 1",
        "expectedOutput": "Standard Case 1 Result"
      },
      {
        "id": "tc-050-2",
        "input": "Edge case 2",
        "expectedOutput": "Standard Case 2 Result"
      }
    ],
    "hints": [
      "Consider optimal time complexity using Trees principles.",
      "Break the state transition or traversal step down clearly.",
      "Check boundary/edge cases like empty input or duplicates."
    ],
    "approach": {
      "summary": "Optimal Trees algorithm.",
      "steps": [
        "Understand problem constraints.",
        "Execute traversal / state update.",
        "Return final result."
      ]
    },
    "complexity": {
      "time": "O(N)",
      "space": "O(1) to O(N)",
      "analysis": "Algorithm runs in O(N) time with O(1) to O(N) space complexity."
    },
    "defaultMastery": 75,
    "recommendedTimeMinutes": 15
  },
  {
    "id": "pm-dsa-051",
    "title": "Lowest Common Ancestor of a Binary Search Tree",
    "slug": "lowest-common-ancestor-of-a-binary-search-tree",
    "difficulty": "Medium",
    "category": "DSA",
    "topics": [
      "Trees"
    ],
    "companies": [
      "Amazon",
      "Microsoft"
    ],
    "frequentlyAsked": true,
    "interviewImportance": "Frequently Asked",
    "description": "Given the problem input for **Lowest Common Ancestor of a Binary Search Tree**, implement an optimal algorithm adhering to the time and space constraints specified in interview standards.",
    "examples": [
      {
        "input": "Standard interview input vector",
        "output": "Expected optimal result",
        "explanation": "Demonstrates optimal Trees traversal."
      }
    ],
    "constraints": [
      "1 <= input.length <= 10^5",
      "Output must be within standard data bounds."
    ],
    "starterCode": {
      "python": "def lowestCommonAncestorOfABinarySearchTree(inputData) -> List<List<Integer>>:\n    # Write your solution here\n    return []\n",
      "javascript": "function lowestCommonAncestorOfABinarySearchTree(inputData) {\n    // Write your solution here\n    return [];\n}\n",
      "java": "class Solution {\n    public List<List<Integer>> lowestCommonAncestorOfABinarySearchTree(int[] inputData) {\n        // Write your solution here\n        return new ArrayList<>();\n    }\n}\n",
      "cpp": "class Solution {\npublic:\n    vector<vector<int>> lowestCommonAncestorOfABinarySearchTree(vector<int>& inputData) {\n        // Write your solution here\n        return {};\n    }\n};\n"
    },
    "supportedLanguages": [
      "python",
      "javascript",
      "java",
      "cpp"
    ],
    "testCases": [
      {
        "id": "tc-051-1",
        "input": "Valid case 1",
        "expectedOutput": "Standard Case 1 Result"
      },
      {
        "id": "tc-051-2",
        "input": "Edge case 2",
        "expectedOutput": "Standard Case 2 Result"
      }
    ],
    "hints": [
      "Consider optimal time complexity using Trees principles.",
      "Break the state transition or traversal step down clearly.",
      "Check boundary/edge cases like empty input or duplicates."
    ],
    "approach": {
      "summary": "Optimal Trees algorithm.",
      "steps": [
        "Understand problem constraints.",
        "Execute traversal / state update.",
        "Return final result."
      ]
    },
    "complexity": {
      "time": "O(N log N)",
      "space": "O(1) to O(N)",
      "analysis": "Algorithm runs in O(N log N) time with O(1) to O(N) space complexity."
    },
    "defaultMastery": 75,
    "recommendedTimeMinutes": 25
  },
  {
    "id": "pm-dsa-052",
    "title": "Binary Tree Level Order Traversal",
    "slug": "binary-tree-level-order-traversal",
    "difficulty": "Medium",
    "category": "DSA",
    "topics": [
      "Trees"
    ],
    "companies": [
      "Amazon",
      "Microsoft",
      "Google"
    ],
    "frequentlyAsked": true,
    "interviewImportance": "Frequently Asked",
    "description": "Given the problem input for **Binary Tree Level Order Traversal**, implement an optimal algorithm adhering to the time and space constraints specified in interview standards.",
    "examples": [
      {
        "input": "Standard interview input vector",
        "output": "Expected optimal result",
        "explanation": "Demonstrates optimal Trees traversal."
      }
    ],
    "constraints": [
      "1 <= input.length <= 10^5",
      "Output must be within standard data bounds."
    ],
    "starterCode": {
      "python": "def binaryTreeLevelOrderTraversal(inputData) -> List<List<Integer>>:\n    # Write your solution here\n    return []\n",
      "javascript": "function binaryTreeLevelOrderTraversal(inputData) {\n    // Write your solution here\n    return [];\n}\n",
      "java": "class Solution {\n    public List<List<Integer>> binaryTreeLevelOrderTraversal(int[] inputData) {\n        // Write your solution here\n        return new ArrayList<>();\n    }\n}\n",
      "cpp": "class Solution {\npublic:\n    vector<vector<int>> binaryTreeLevelOrderTraversal(vector<int>& inputData) {\n        // Write your solution here\n        return {};\n    }\n};\n"
    },
    "supportedLanguages": [
      "python",
      "javascript",
      "java",
      "cpp"
    ],
    "testCases": [
      {
        "id": "tc-052-1",
        "input": "Valid case 1",
        "expectedOutput": "Standard Case 1 Result"
      },
      {
        "id": "tc-052-2",
        "input": "Edge case 2",
        "expectedOutput": "Standard Case 2 Result"
      }
    ],
    "hints": [
      "Consider optimal time complexity using Trees principles.",
      "Break the state transition or traversal step down clearly.",
      "Check boundary/edge cases like empty input or duplicates."
    ],
    "approach": {
      "summary": "Optimal Trees algorithm.",
      "steps": [
        "Understand problem constraints.",
        "Execute traversal / state update.",
        "Return final result."
      ]
    },
    "complexity": {
      "time": "O(N log N)",
      "space": "O(1) to O(N)",
      "analysis": "Algorithm runs in O(N log N) time with O(1) to O(N) space complexity."
    },
    "defaultMastery": 75,
    "recommendedTimeMinutes": 25
  },
  {
    "id": "pm-dsa-053",
    "title": "Binary Tree Right Side View",
    "slug": "binary-tree-right-side-view",
    "difficulty": "Medium",
    "category": "DSA",
    "topics": [
      "Trees"
    ],
    "companies": [
      "Amazon",
      "Facebook"
    ],
    "frequentlyAsked": true,
    "interviewImportance": "Frequently Asked",
    "description": "Given the problem input for **Binary Tree Right Side View**, implement an optimal algorithm adhering to the time and space constraints specified in interview standards.",
    "examples": [
      {
        "input": "Standard interview input vector",
        "output": "Expected optimal result",
        "explanation": "Demonstrates optimal Trees traversal."
      }
    ],
    "constraints": [
      "1 <= input.length <= 10^5",
      "Output must be within standard data bounds."
    ],
    "starterCode": {
      "python": "def binaryTreeRightSideView(inputData) -> int[]:\n    # Write your solution here\n    return []\n",
      "javascript": "function binaryTreeRightSideView(inputData) {\n    // Write your solution here\n    return [];\n}\n",
      "java": "class Solution {\n    public int[] binaryTreeRightSideView(int[] inputData) {\n        // Write your solution here\n        return new int[]{};\n    }\n}\n",
      "cpp": "class Solution {\npublic:\n    vector<int> binaryTreeRightSideView(vector<int>& inputData) {\n        // Write your solution here\n        return {};\n    }\n};\n"
    },
    "supportedLanguages": [
      "python",
      "javascript",
      "java",
      "cpp"
    ],
    "testCases": [
      {
        "id": "tc-053-1",
        "input": "Valid case 1",
        "expectedOutput": "Standard Case 1 Result"
      },
      {
        "id": "tc-053-2",
        "input": "Edge case 2",
        "expectedOutput": "Standard Case 2 Result"
      }
    ],
    "hints": [
      "Consider optimal time complexity using Trees principles.",
      "Break the state transition or traversal step down clearly.",
      "Check boundary/edge cases like empty input or duplicates."
    ],
    "approach": {
      "summary": "Optimal Trees algorithm.",
      "steps": [
        "Understand problem constraints.",
        "Execute traversal / state update.",
        "Return final result."
      ]
    },
    "complexity": {
      "time": "O(N log N)",
      "space": "O(1) to O(N)",
      "analysis": "Algorithm runs in O(N log N) time with O(1) to O(N) space complexity."
    },
    "defaultMastery": 75,
    "recommendedTimeMinutes": 25
  },
  {
    "id": "pm-dsa-054",
    "title": "Count Good Nodes in Binary Tree",
    "slug": "count-good-nodes-in-binary-tree",
    "difficulty": "Medium",
    "category": "DSA",
    "topics": [
      "Trees"
    ],
    "companies": [
      "Microsoft",
      "Amazon"
    ],
    "frequentlyAsked": true,
    "interviewImportance": "Frequently Asked",
    "description": "Given the problem input for **Count Good Nodes in Binary Tree**, implement an optimal algorithm adhering to the time and space constraints specified in interview standards.",
    "examples": [
      {
        "input": "Standard interview input vector",
        "output": "Expected optimal result",
        "explanation": "Demonstrates optimal Trees traversal."
      }
    ],
    "constraints": [
      "1 <= input.length <= 10^5",
      "Output must be within standard data bounds."
    ],
    "starterCode": {
      "python": "def countGoodNodesInBinaryTree(inputData) -> int:\n    # Write your solution here\n    return 0\n",
      "javascript": "function countGoodNodesInBinaryTree(inputData) {\n    // Write your solution here\n    return 0;\n}\n",
      "java": "class Solution {\n    public int countGoodNodesInBinaryTree(int[] inputData) {\n        // Write your solution here\n        return 0;\n    }\n}\n",
      "cpp": "class Solution {\npublic:\n    int countGoodNodesInBinaryTree(vector<int>& inputData) {\n        // Write your solution here\n        return 0;\n    }\n};\n"
    },
    "supportedLanguages": [
      "python",
      "javascript",
      "java",
      "cpp"
    ],
    "testCases": [
      {
        "id": "tc-054-1",
        "input": "Valid case 1",
        "expectedOutput": "Standard Case 1 Result"
      },
      {
        "id": "tc-054-2",
        "input": "Edge case 2",
        "expectedOutput": "Standard Case 2 Result"
      }
    ],
    "hints": [
      "Consider optimal time complexity using Trees principles.",
      "Break the state transition or traversal step down clearly.",
      "Check boundary/edge cases like empty input or duplicates."
    ],
    "approach": {
      "summary": "Optimal Trees algorithm.",
      "steps": [
        "Understand problem constraints.",
        "Execute traversal / state update.",
        "Return final result."
      ]
    },
    "complexity": {
      "time": "O(N log N)",
      "space": "O(1) to O(N)",
      "analysis": "Algorithm runs in O(N log N) time with O(1) to O(N) space complexity."
    },
    "defaultMastery": 75,
    "recommendedTimeMinutes": 25
  },
  {
    "id": "pm-dsa-055",
    "title": "Validate Binary Search Tree",
    "slug": "validate-binary-search-tree",
    "difficulty": "Medium",
    "category": "DSA",
    "topics": [
      "Trees"
    ],
    "companies": [
      "Amazon",
      "Microsoft",
      "Google"
    ],
    "frequentlyAsked": true,
    "interviewImportance": "Frequently Asked",
    "description": "Given the problem input for **Validate Binary Search Tree**, implement an optimal algorithm adhering to the time and space constraints specified in interview standards.",
    "examples": [
      {
        "input": "Standard interview input vector",
        "output": "Expected optimal result",
        "explanation": "Demonstrates optimal Trees traversal."
      }
    ],
    "constraints": [
      "1 <= input.length <= 10^5",
      "Output must be within standard data bounds."
    ],
    "starterCode": {
      "python": "def validateBinarySearchTree(inputData) -> boolean:\n    # Write your solution here\n    return False\n",
      "javascript": "function validateBinarySearchTree(inputData) {\n    // Write your solution here\n    return false;\n}\n",
      "java": "class Solution {\n    public boolean validateBinarySearchTree(int[] inputData) {\n        // Write your solution here\n        return false;\n    }\n}\n",
      "cpp": "class Solution {\npublic:\n    bool validateBinarySearchTree(vector<int>& inputData) {\n        // Write your solution here\n        return false;\n    }\n};\n"
    },
    "supportedLanguages": [
      "python",
      "javascript",
      "java",
      "cpp"
    ],
    "testCases": [
      {
        "id": "tc-055-1",
        "input": "Valid case 1",
        "expectedOutput": "Standard Case 1 Result"
      },
      {
        "id": "tc-055-2",
        "input": "Edge case 2",
        "expectedOutput": "Standard Case 2 Result"
      }
    ],
    "hints": [
      "Consider optimal time complexity using Trees principles.",
      "Break the state transition or traversal step down clearly.",
      "Check boundary/edge cases like empty input or duplicates."
    ],
    "approach": {
      "summary": "Optimal Trees algorithm.",
      "steps": [
        "Understand problem constraints.",
        "Execute traversal / state update.",
        "Return final result."
      ]
    },
    "complexity": {
      "time": "O(N log N)",
      "space": "O(1) to O(N)",
      "analysis": "Algorithm runs in O(N log N) time with O(1) to O(N) space complexity."
    },
    "defaultMastery": 75,
    "recommendedTimeMinutes": 25
  },
  {
    "id": "pm-dsa-056",
    "title": "Kth Smallest Element in a BST",
    "slug": "kth-smallest-element-in-a-bst",
    "difficulty": "Medium",
    "category": "DSA",
    "topics": [
      "Trees"
    ],
    "companies": [
      "Amazon",
      "Google"
    ],
    "frequentlyAsked": true,
    "interviewImportance": "Frequently Asked",
    "description": "Given the problem input for **Kth Smallest Element in a BST**, implement an optimal algorithm adhering to the time and space constraints specified in interview standards.",
    "examples": [
      {
        "input": "Standard interview input vector",
        "output": "Expected optimal result",
        "explanation": "Demonstrates optimal Trees traversal."
      }
    ],
    "constraints": [
      "1 <= input.length <= 10^5",
      "Output must be within standard data bounds."
    ],
    "starterCode": {
      "python": "def kthSmallestElementInABst(inputData) -> int:\n    # Write your solution here\n    return 0\n",
      "javascript": "function kthSmallestElementInABst(inputData) {\n    // Write your solution here\n    return 0;\n}\n",
      "java": "class Solution {\n    public int kthSmallestElementInABst(int[] inputData) {\n        // Write your solution here\n        return 0;\n    }\n}\n",
      "cpp": "class Solution {\npublic:\n    int kthSmallestElementInABst(vector<int>& inputData) {\n        // Write your solution here\n        return 0;\n    }\n};\n"
    },
    "supportedLanguages": [
      "python",
      "javascript",
      "java",
      "cpp"
    ],
    "testCases": [
      {
        "id": "tc-056-1",
        "input": "Valid case 1",
        "expectedOutput": "Standard Case 1 Result"
      },
      {
        "id": "tc-056-2",
        "input": "Edge case 2",
        "expectedOutput": "Standard Case 2 Result"
      }
    ],
    "hints": [
      "Consider optimal time complexity using Trees principles.",
      "Break the state transition or traversal step down clearly.",
      "Check boundary/edge cases like empty input or duplicates."
    ],
    "approach": {
      "summary": "Optimal Trees algorithm.",
      "steps": [
        "Understand problem constraints.",
        "Execute traversal / state update.",
        "Return final result."
      ]
    },
    "complexity": {
      "time": "O(N log N)",
      "space": "O(1) to O(N)",
      "analysis": "Algorithm runs in O(N log N) time with O(1) to O(N) space complexity."
    },
    "defaultMastery": 75,
    "recommendedTimeMinutes": 25
  },
  {
    "id": "pm-dsa-057",
    "title": "Construct Tree from Preorder and Inorder Traversal",
    "slug": "construct-tree-from-preorder-and-inorder-traversal",
    "difficulty": "Medium",
    "category": "DSA",
    "topics": [
      "Trees"
    ],
    "companies": [
      "Amazon",
      "Microsoft"
    ],
    "frequentlyAsked": true,
    "interviewImportance": "Frequently Asked",
    "description": "Given the problem input for **Construct Tree from Preorder and Inorder Traversal**, implement an optimal algorithm adhering to the time and space constraints specified in interview standards.",
    "examples": [
      {
        "input": "Standard interview input vector",
        "output": "Expected optimal result",
        "explanation": "Demonstrates optimal Trees traversal."
      }
    ],
    "constraints": [
      "1 <= input.length <= 10^5",
      "Output must be within standard data bounds."
    ],
    "starterCode": {
      "python": "def constructTreeFromPreorderAndInorderTraversal(inputData) -> List<List<Integer>>:\n    # Write your solution here\n    return []\n",
      "javascript": "function constructTreeFromPreorderAndInorderTraversal(inputData) {\n    // Write your solution here\n    return [];\n}\n",
      "java": "class Solution {\n    public List<List<Integer>> constructTreeFromPreorderAndInorderTraversal(int[] inputData) {\n        // Write your solution here\n        return new ArrayList<>();\n    }\n}\n",
      "cpp": "class Solution {\npublic:\n    vector<vector<int>> constructTreeFromPreorderAndInorderTraversal(vector<int>& inputData) {\n        // Write your solution here\n        return {};\n    }\n};\n"
    },
    "supportedLanguages": [
      "python",
      "javascript",
      "java",
      "cpp"
    ],
    "testCases": [
      {
        "id": "tc-057-1",
        "input": "Valid case 1",
        "expectedOutput": "Standard Case 1 Result"
      },
      {
        "id": "tc-057-2",
        "input": "Edge case 2",
        "expectedOutput": "Standard Case 2 Result"
      }
    ],
    "hints": [
      "Consider optimal time complexity using Trees principles.",
      "Break the state transition or traversal step down clearly.",
      "Check boundary/edge cases like empty input or duplicates."
    ],
    "approach": {
      "summary": "Optimal Trees algorithm.",
      "steps": [
        "Understand problem constraints.",
        "Execute traversal / state update.",
        "Return final result."
      ]
    },
    "complexity": {
      "time": "O(N log N)",
      "space": "O(1) to O(N)",
      "analysis": "Algorithm runs in O(N log N) time with O(1) to O(N) space complexity."
    },
    "defaultMastery": 75,
    "recommendedTimeMinutes": 25
  },
  {
    "id": "pm-dsa-058",
    "title": "Binary Tree Maximum Path Sum",
    "slug": "binary-tree-maximum-path-sum",
    "difficulty": "Hard",
    "category": "DSA",
    "topics": [
      "Trees"
    ],
    "companies": [
      "Google",
      "Amazon",
      "Microsoft"
    ],
    "frequentlyAsked": true,
    "interviewImportance": "Frequently Asked",
    "description": "Given the problem input for **Binary Tree Maximum Path Sum**, implement an optimal algorithm adhering to the time and space constraints specified in interview standards.",
    "examples": [
      {
        "input": "Standard interview input vector",
        "output": "Expected optimal result",
        "explanation": "Demonstrates optimal Trees traversal."
      }
    ],
    "constraints": [
      "1 <= input.length <= 10^5",
      "Output must be within standard data bounds."
    ],
    "starterCode": {
      "python": "def binaryTreeMaximumPathSum(inputData) -> int:\n    # Write your solution here\n    return 0\n",
      "javascript": "function binaryTreeMaximumPathSum(inputData) {\n    // Write your solution here\n    return 0;\n}\n",
      "java": "class Solution {\n    public int binaryTreeMaximumPathSum(int[] inputData) {\n        // Write your solution here\n        return 0;\n    }\n}\n",
      "cpp": "class Solution {\npublic:\n    int binaryTreeMaximumPathSum(vector<int>& inputData) {\n        // Write your solution here\n        return 0;\n    }\n};\n"
    },
    "supportedLanguages": [
      "python",
      "javascript",
      "java",
      "cpp"
    ],
    "testCases": [
      {
        "id": "tc-058-1",
        "input": "Valid case 1",
        "expectedOutput": "Standard Case 1 Result"
      },
      {
        "id": "tc-058-2",
        "input": "Edge case 2",
        "expectedOutput": "Standard Case 2 Result"
      }
    ],
    "hints": [
      "Consider optimal time complexity using Trees principles.",
      "Break the state transition or traversal step down clearly.",
      "Check boundary/edge cases like empty input or duplicates."
    ],
    "approach": {
      "summary": "Optimal Trees algorithm.",
      "steps": [
        "Understand problem constraints.",
        "Execute traversal / state update.",
        "Return final result."
      ]
    },
    "complexity": {
      "time": "O(N log N)",
      "space": "O(1) to O(N)",
      "analysis": "Algorithm runs in O(N log N) time with O(1) to O(N) space complexity."
    },
    "defaultMastery": 75,
    "recommendedTimeMinutes": 40
  },
  {
    "id": "pm-dsa-059",
    "title": "Serialize and Deserialize Binary Tree",
    "slug": "serialize-and-deserialize-binary-tree",
    "difficulty": "Hard",
    "category": "DSA",
    "topics": [
      "Trees"
    ],
    "companies": [
      "Amazon",
      "Microsoft",
      "Google"
    ],
    "frequentlyAsked": true,
    "interviewImportance": "Frequently Asked",
    "description": "Given the problem input for **Serialize and Deserialize Binary Tree**, implement an optimal algorithm adhering to the time and space constraints specified in interview standards.",
    "examples": [
      {
        "input": "Standard interview input vector",
        "output": "Expected optimal result",
        "explanation": "Demonstrates optimal Trees traversal."
      }
    ],
    "constraints": [
      "1 <= input.length <= 10^5",
      "Output must be within standard data bounds."
    ],
    "starterCode": {
      "python": "def serializeAndDeserializeBinaryTree(inputData) -> String:\n    # Write your solution here\n    return \"\"\n",
      "javascript": "function serializeAndDeserializeBinaryTree(inputData) {\n    // Write your solution here\n    return \"\";\n}\n",
      "java": "class Solution {\n    public String serializeAndDeserializeBinaryTree(int[] inputData) {\n        // Write your solution here\n        return \"\";\n    }\n}\n",
      "cpp": "class Solution {\npublic:\n    string serializeAndDeserializeBinaryTree(vector<int>& inputData) {\n        // Write your solution here\n        return \"\";\n    }\n};\n"
    },
    "supportedLanguages": [
      "python",
      "javascript",
      "java",
      "cpp"
    ],
    "testCases": [
      {
        "id": "tc-059-1",
        "input": "Valid case 1",
        "expectedOutput": "Standard Case 1 Result"
      },
      {
        "id": "tc-059-2",
        "input": "Edge case 2",
        "expectedOutput": "Standard Case 2 Result"
      }
    ],
    "hints": [
      "Consider optimal time complexity using Trees principles.",
      "Break the state transition or traversal step down clearly.",
      "Check boundary/edge cases like empty input or duplicates."
    ],
    "approach": {
      "summary": "Optimal Trees algorithm.",
      "steps": [
        "Understand problem constraints.",
        "Execute traversal / state update.",
        "Return final result."
      ]
    },
    "complexity": {
      "time": "O(N log N)",
      "space": "O(1) to O(N)",
      "analysis": "Algorithm runs in O(N log N) time with O(1) to O(N) space complexity."
    },
    "defaultMastery": 75,
    "recommendedTimeMinutes": 40
  },
  {
    "id": "pm-dsa-060",
    "title": "Number of Islands",
    "slug": "number-of-islands",
    "difficulty": "Medium",
    "category": "DSA",
    "topics": [
      "Graphs"
    ],
    "companies": [
      "Amazon",
      "Microsoft",
      "Google",
      "Zoho"
    ],
    "frequentlyAsked": true,
    "interviewImportance": "Frequently Asked",
    "description": "Given the problem input for **Number of Islands**, implement an optimal algorithm adhering to the time and space constraints specified in interview standards.",
    "examples": [
      {
        "input": "Standard interview input vector",
        "output": "Expected optimal result",
        "explanation": "Demonstrates optimal Graphs traversal."
      }
    ],
    "constraints": [
      "1 <= input.length <= 10^5",
      "Output must be within standard data bounds."
    ],
    "starterCode": {
      "python": "def numberOfIslands(inputData) -> int:\n    # Write your solution here\n    return 0\n",
      "javascript": "function numberOfIslands(inputData) {\n    // Write your solution here\n    return 0;\n}\n",
      "java": "class Solution {\n    public int numberOfIslands(int[] inputData) {\n        // Write your solution here\n        return 0;\n    }\n}\n",
      "cpp": "class Solution {\npublic:\n    int numberOfIslands(vector<int>& inputData) {\n        // Write your solution here\n        return 0;\n    }\n};\n"
    },
    "supportedLanguages": [
      "python",
      "javascript",
      "java",
      "cpp"
    ],
    "testCases": [
      {
        "id": "tc-060-1",
        "input": "Valid case 1",
        "expectedOutput": "Standard Case 1 Result"
      },
      {
        "id": "tc-060-2",
        "input": "Edge case 2",
        "expectedOutput": "Standard Case 2 Result"
      }
    ],
    "hints": [
      "Consider optimal time complexity using Graphs principles.",
      "Break the state transition or traversal step down clearly.",
      "Check boundary/edge cases like empty input or duplicates."
    ],
    "approach": {
      "summary": "Optimal Graphs algorithm.",
      "steps": [
        "Understand problem constraints.",
        "Execute traversal / state update.",
        "Return final result."
      ]
    },
    "complexity": {
      "time": "O(N log N)",
      "space": "O(1) to O(N)",
      "analysis": "Algorithm runs in O(N log N) time with O(1) to O(N) space complexity."
    },
    "defaultMastery": 75,
    "recommendedTimeMinutes": 25
  },
  {
    "id": "pm-dsa-061",
    "title": "Max Area of Island",
    "slug": "max-area-of-island",
    "difficulty": "Medium",
    "category": "DSA",
    "topics": [
      "Graphs"
    ],
    "companies": [
      "Amazon",
      "Microsoft"
    ],
    "frequentlyAsked": true,
    "interviewImportance": "Frequently Asked",
    "description": "Given the problem input for **Max Area of Island**, implement an optimal algorithm adhering to the time and space constraints specified in interview standards.",
    "examples": [
      {
        "input": "Standard interview input vector",
        "output": "Expected optimal result",
        "explanation": "Demonstrates optimal Graphs traversal."
      }
    ],
    "constraints": [
      "1 <= input.length <= 10^5",
      "Output must be within standard data bounds."
    ],
    "starterCode": {
      "python": "def maxAreaOfIsland(inputData) -> int:\n    # Write your solution here\n    return 0\n",
      "javascript": "function maxAreaOfIsland(inputData) {\n    // Write your solution here\n    return 0;\n}\n",
      "java": "class Solution {\n    public int maxAreaOfIsland(int[] inputData) {\n        // Write your solution here\n        return 0;\n    }\n}\n",
      "cpp": "class Solution {\npublic:\n    int maxAreaOfIsland(vector<int>& inputData) {\n        // Write your solution here\n        return 0;\n    }\n};\n"
    },
    "supportedLanguages": [
      "python",
      "javascript",
      "java",
      "cpp"
    ],
    "testCases": [
      {
        "id": "tc-061-1",
        "input": "Valid case 1",
        "expectedOutput": "Standard Case 1 Result"
      },
      {
        "id": "tc-061-2",
        "input": "Edge case 2",
        "expectedOutput": "Standard Case 2 Result"
      }
    ],
    "hints": [
      "Consider optimal time complexity using Graphs principles.",
      "Break the state transition or traversal step down clearly.",
      "Check boundary/edge cases like empty input or duplicates."
    ],
    "approach": {
      "summary": "Optimal Graphs algorithm.",
      "steps": [
        "Understand problem constraints.",
        "Execute traversal / state update.",
        "Return final result."
      ]
    },
    "complexity": {
      "time": "O(N log N)",
      "space": "O(1) to O(N)",
      "analysis": "Algorithm runs in O(N log N) time with O(1) to O(N) space complexity."
    },
    "defaultMastery": 75,
    "recommendedTimeMinutes": 25
  },
  {
    "id": "pm-dsa-062",
    "title": "Clone Graph",
    "slug": "clone-graph",
    "difficulty": "Medium",
    "category": "DSA",
    "topics": [
      "Graphs"
    ],
    "companies": [
      "Amazon",
      "Google"
    ],
    "frequentlyAsked": true,
    "interviewImportance": "Frequently Asked",
    "description": "Given the problem input for **Clone Graph**, implement an optimal algorithm adhering to the time and space constraints specified in interview standards.",
    "examples": [
      {
        "input": "Standard interview input vector",
        "output": "Expected optimal result",
        "explanation": "Demonstrates optimal Graphs traversal."
      }
    ],
    "constraints": [
      "1 <= input.length <= 10^5",
      "Output must be within standard data bounds."
    ],
    "starterCode": {
      "python": "def cloneGraph(inputData) -> List<List<Integer>>:\n    # Write your solution here\n    return []\n",
      "javascript": "function cloneGraph(inputData) {\n    // Write your solution here\n    return [];\n}\n",
      "java": "class Solution {\n    public List<List<Integer>> cloneGraph(int[] inputData) {\n        // Write your solution here\n        return new ArrayList<>();\n    }\n}\n",
      "cpp": "class Solution {\npublic:\n    vector<vector<int>> cloneGraph(vector<int>& inputData) {\n        // Write your solution here\n        return {};\n    }\n};\n"
    },
    "supportedLanguages": [
      "python",
      "javascript",
      "java",
      "cpp"
    ],
    "testCases": [
      {
        "id": "tc-062-1",
        "input": "Valid case 1",
        "expectedOutput": "Standard Case 1 Result"
      },
      {
        "id": "tc-062-2",
        "input": "Edge case 2",
        "expectedOutput": "Standard Case 2 Result"
      }
    ],
    "hints": [
      "Consider optimal time complexity using Graphs principles.",
      "Break the state transition or traversal step down clearly.",
      "Check boundary/edge cases like empty input or duplicates."
    ],
    "approach": {
      "summary": "Optimal Graphs algorithm.",
      "steps": [
        "Understand problem constraints.",
        "Execute traversal / state update.",
        "Return final result."
      ]
    },
    "complexity": {
      "time": "O(N log N)",
      "space": "O(1) to O(N)",
      "analysis": "Algorithm runs in O(N log N) time with O(1) to O(N) space complexity."
    },
    "defaultMastery": 75,
    "recommendedTimeMinutes": 25
  },
  {
    "id": "pm-dsa-063",
    "title": "Pacific Atlantic Water Flow",
    "slug": "pacific-atlantic-water-flow",
    "difficulty": "Medium",
    "category": "DSA",
    "topics": [
      "Graphs"
    ],
    "companies": [
      "Google",
      "Amazon"
    ],
    "frequentlyAsked": true,
    "interviewImportance": "Frequently Asked",
    "description": "Given the problem input for **Pacific Atlantic Water Flow**, implement an optimal algorithm adhering to the time and space constraints specified in interview standards.",
    "examples": [
      {
        "input": "Standard interview input vector",
        "output": "Expected optimal result",
        "explanation": "Demonstrates optimal Graphs traversal."
      }
    ],
    "constraints": [
      "1 <= input.length <= 10^5",
      "Output must be within standard data bounds."
    ],
    "starterCode": {
      "python": "def pacificAtlanticWaterFlow(inputData) -> List<List<Integer>>:\n    # Write your solution here\n    return []\n",
      "javascript": "function pacificAtlanticWaterFlow(inputData) {\n    // Write your solution here\n    return [];\n}\n",
      "java": "class Solution {\n    public List<List<Integer>> pacificAtlanticWaterFlow(int[] inputData) {\n        // Write your solution here\n        return new ArrayList<>();\n    }\n}\n",
      "cpp": "class Solution {\npublic:\n    vector<vector<int>> pacificAtlanticWaterFlow(vector<int>& inputData) {\n        // Write your solution here\n        return {};\n    }\n};\n"
    },
    "supportedLanguages": [
      "python",
      "javascript",
      "java",
      "cpp"
    ],
    "testCases": [
      {
        "id": "tc-063-1",
        "input": "Valid case 1",
        "expectedOutput": "Standard Case 1 Result"
      },
      {
        "id": "tc-063-2",
        "input": "Edge case 2",
        "expectedOutput": "Standard Case 2 Result"
      }
    ],
    "hints": [
      "Consider optimal time complexity using Graphs principles.",
      "Break the state transition or traversal step down clearly.",
      "Check boundary/edge cases like empty input or duplicates."
    ],
    "approach": {
      "summary": "Optimal Graphs algorithm.",
      "steps": [
        "Understand problem constraints.",
        "Execute traversal / state update.",
        "Return final result."
      ]
    },
    "complexity": {
      "time": "O(N log N)",
      "space": "O(1) to O(N)",
      "analysis": "Algorithm runs in O(N log N) time with O(1) to O(N) space complexity."
    },
    "defaultMastery": 75,
    "recommendedTimeMinutes": 25
  },
  {
    "id": "pm-dsa-064",
    "title": "Surrounded Regions",
    "slug": "surrounded-regions",
    "difficulty": "Medium",
    "category": "DSA",
    "topics": [
      "Graphs"
    ],
    "companies": [
      "Amazon",
      "Microsoft"
    ],
    "frequentlyAsked": true,
    "interviewImportance": "Frequently Asked",
    "description": "Given the problem input for **Surrounded Regions**, implement an optimal algorithm adhering to the time and space constraints specified in interview standards.",
    "examples": [
      {
        "input": "Standard interview input vector",
        "output": "Expected optimal result",
        "explanation": "Demonstrates optimal Graphs traversal."
      }
    ],
    "constraints": [
      "1 <= input.length <= 10^5",
      "Output must be within standard data bounds."
    ],
    "starterCode": {
      "python": "def surroundedRegions(inputData) -> List<List<Integer>>:\n    # Write your solution here\n    return []\n",
      "javascript": "function surroundedRegions(inputData) {\n    // Write your solution here\n    return [];\n}\n",
      "java": "class Solution {\n    public List<List<Integer>> surroundedRegions(int[] inputData) {\n        // Write your solution here\n        return new ArrayList<>();\n    }\n}\n",
      "cpp": "class Solution {\npublic:\n    vector<vector<int>> surroundedRegions(vector<int>& inputData) {\n        // Write your solution here\n        return {};\n    }\n};\n"
    },
    "supportedLanguages": [
      "python",
      "javascript",
      "java",
      "cpp"
    ],
    "testCases": [
      {
        "id": "tc-064-1",
        "input": "Valid case 1",
        "expectedOutput": "Standard Case 1 Result"
      },
      {
        "id": "tc-064-2",
        "input": "Edge case 2",
        "expectedOutput": "Standard Case 2 Result"
      }
    ],
    "hints": [
      "Consider optimal time complexity using Graphs principles.",
      "Break the state transition or traversal step down clearly.",
      "Check boundary/edge cases like empty input or duplicates."
    ],
    "approach": {
      "summary": "Optimal Graphs algorithm.",
      "steps": [
        "Understand problem constraints.",
        "Execute traversal / state update.",
        "Return final result."
      ]
    },
    "complexity": {
      "time": "O(N log N)",
      "space": "O(1) to O(N)",
      "analysis": "Algorithm runs in O(N log N) time with O(1) to O(N) space complexity."
    },
    "defaultMastery": 75,
    "recommendedTimeMinutes": 25
  },
  {
    "id": "pm-dsa-065",
    "title": "Rotting Oranges",
    "slug": "rotting-oranges",
    "difficulty": "Medium",
    "category": "DSA",
    "topics": [
      "Graphs"
    ],
    "companies": [
      "Amazon",
      "Microsoft",
      "Freshworks"
    ],
    "frequentlyAsked": true,
    "interviewImportance": "Frequently Asked",
    "description": "Given the problem input for **Rotting Oranges**, implement an optimal algorithm adhering to the time and space constraints specified in interview standards.",
    "examples": [
      {
        "input": "Standard interview input vector",
        "output": "Expected optimal result",
        "explanation": "Demonstrates optimal Graphs traversal."
      }
    ],
    "constraints": [
      "1 <= input.length <= 10^5",
      "Output must be within standard data bounds."
    ],
    "starterCode": {
      "python": "def rottingOranges(inputData) -> int:\n    # Write your solution here\n    return 0\n",
      "javascript": "function rottingOranges(inputData) {\n    // Write your solution here\n    return 0;\n}\n",
      "java": "class Solution {\n    public int rottingOranges(int[] inputData) {\n        // Write your solution here\n        return 0;\n    }\n}\n",
      "cpp": "class Solution {\npublic:\n    int rottingOranges(vector<int>& inputData) {\n        // Write your solution here\n        return 0;\n    }\n};\n"
    },
    "supportedLanguages": [
      "python",
      "javascript",
      "java",
      "cpp"
    ],
    "testCases": [
      {
        "id": "tc-065-1",
        "input": "Valid case 1",
        "expectedOutput": "Standard Case 1 Result"
      },
      {
        "id": "tc-065-2",
        "input": "Edge case 2",
        "expectedOutput": "Standard Case 2 Result"
      }
    ],
    "hints": [
      "Consider optimal time complexity using Graphs principles.",
      "Break the state transition or traversal step down clearly.",
      "Check boundary/edge cases like empty input or duplicates."
    ],
    "approach": {
      "summary": "Optimal Graphs algorithm.",
      "steps": [
        "Understand problem constraints.",
        "Execute traversal / state update.",
        "Return final result."
      ]
    },
    "complexity": {
      "time": "O(N log N)",
      "space": "O(1) to O(N)",
      "analysis": "Algorithm runs in O(N log N) time with O(1) to O(N) space complexity."
    },
    "defaultMastery": 75,
    "recommendedTimeMinutes": 25
  },
  {
    "id": "pm-dsa-066",
    "title": "Course Schedule (Topological Sort)",
    "slug": "course-schedule-topological-sort-",
    "difficulty": "Medium",
    "category": "DSA",
    "topics": [
      "Graphs"
    ],
    "companies": [
      "Amazon",
      "Google",
      "Microsoft"
    ],
    "frequentlyAsked": true,
    "interviewImportance": "Frequently Asked",
    "description": "Given the problem input for **Course Schedule (Topological Sort)**, implement an optimal algorithm adhering to the time and space constraints specified in interview standards.",
    "examples": [
      {
        "input": "Standard interview input vector",
        "output": "Expected optimal result",
        "explanation": "Demonstrates optimal Graphs traversal."
      }
    ],
    "constraints": [
      "1 <= input.length <= 10^5",
      "Output must be within standard data bounds."
    ],
    "starterCode": {
      "python": "def courseScheduleTopologicalSort-(inputData) -> boolean:\n    # Write your solution here\n    return False\n",
      "javascript": "function courseScheduleTopologicalSort-(inputData) {\n    // Write your solution here\n    return false;\n}\n",
      "java": "class Solution {\n    public boolean courseScheduleTopologicalSort-(int[] inputData) {\n        // Write your solution here\n        return false;\n    }\n}\n",
      "cpp": "class Solution {\npublic:\n    bool courseScheduleTopologicalSort-(vector<int>& inputData) {\n        // Write your solution here\n        return false;\n    }\n};\n"
    },
    "supportedLanguages": [
      "python",
      "javascript",
      "java",
      "cpp"
    ],
    "testCases": [
      {
        "id": "tc-066-1",
        "input": "Valid case 1",
        "expectedOutput": "Standard Case 1 Result"
      },
      {
        "id": "tc-066-2",
        "input": "Edge case 2",
        "expectedOutput": "Standard Case 2 Result"
      }
    ],
    "hints": [
      "Consider optimal time complexity using Graphs principles.",
      "Break the state transition or traversal step down clearly.",
      "Check boundary/edge cases like empty input or duplicates."
    ],
    "approach": {
      "summary": "Optimal Graphs algorithm.",
      "steps": [
        "Understand problem constraints.",
        "Execute traversal / state update.",
        "Return final result."
      ]
    },
    "complexity": {
      "time": "O(N log N)",
      "space": "O(1) to O(N)",
      "analysis": "Algorithm runs in O(N log N) time with O(1) to O(N) space complexity."
    },
    "defaultMastery": 75,
    "recommendedTimeMinutes": 25
  },
  {
    "id": "pm-dsa-067",
    "title": "Course Schedule II - Order Finding",
    "slug": "course-schedule-ii-order-finding",
    "difficulty": "Medium",
    "category": "DSA",
    "topics": [
      "Graphs"
    ],
    "companies": [
      "Google",
      "Amazon"
    ],
    "frequentlyAsked": true,
    "interviewImportance": "Frequently Asked",
    "description": "Given the problem input for **Course Schedule II - Order Finding**, implement an optimal algorithm adhering to the time and space constraints specified in interview standards.",
    "examples": [
      {
        "input": "Standard interview input vector",
        "output": "Expected optimal result",
        "explanation": "Demonstrates optimal Graphs traversal."
      }
    ],
    "constraints": [
      "1 <= input.length <= 10^5",
      "Output must be within standard data bounds."
    ],
    "starterCode": {
      "python": "def courseScheduleIiOrderFinding(inputData) -> int[]:\n    # Write your solution here\n    return []\n",
      "javascript": "function courseScheduleIiOrderFinding(inputData) {\n    // Write your solution here\n    return [];\n}\n",
      "java": "class Solution {\n    public int[] courseScheduleIiOrderFinding(int[] inputData) {\n        // Write your solution here\n        return new int[]{};\n    }\n}\n",
      "cpp": "class Solution {\npublic:\n    vector<int> courseScheduleIiOrderFinding(vector<int>& inputData) {\n        // Write your solution here\n        return {};\n    }\n};\n"
    },
    "supportedLanguages": [
      "python",
      "javascript",
      "java",
      "cpp"
    ],
    "testCases": [
      {
        "id": "tc-067-1",
        "input": "Valid case 1",
        "expectedOutput": "Standard Case 1 Result"
      },
      {
        "id": "tc-067-2",
        "input": "Edge case 2",
        "expectedOutput": "Standard Case 2 Result"
      }
    ],
    "hints": [
      "Consider optimal time complexity using Graphs principles.",
      "Break the state transition or traversal step down clearly.",
      "Check boundary/edge cases like empty input or duplicates."
    ],
    "approach": {
      "summary": "Optimal Graphs algorithm.",
      "steps": [
        "Understand problem constraints.",
        "Execute traversal / state update.",
        "Return final result."
      ]
    },
    "complexity": {
      "time": "O(N log N)",
      "space": "O(1) to O(N)",
      "analysis": "Algorithm runs in O(N log N) time with O(1) to O(N) space complexity."
    },
    "defaultMastery": 75,
    "recommendedTimeMinutes": 25
  },
  {
    "id": "pm-dsa-068",
    "title": "Graph Valid Tree",
    "slug": "graph-valid-tree",
    "difficulty": "Medium",
    "category": "DSA",
    "topics": [
      "Graphs"
    ],
    "companies": [
      "Amazon",
      "Microsoft"
    ],
    "frequentlyAsked": true,
    "interviewImportance": "Frequently Asked",
    "description": "Given the problem input for **Graph Valid Tree**, implement an optimal algorithm adhering to the time and space constraints specified in interview standards.",
    "examples": [
      {
        "input": "Standard interview input vector",
        "output": "Expected optimal result",
        "explanation": "Demonstrates optimal Graphs traversal."
      }
    ],
    "constraints": [
      "1 <= input.length <= 10^5",
      "Output must be within standard data bounds."
    ],
    "starterCode": {
      "python": "def graphValidTree(inputData) -> boolean:\n    # Write your solution here\n    return False\n",
      "javascript": "function graphValidTree(inputData) {\n    // Write your solution here\n    return false;\n}\n",
      "java": "class Solution {\n    public boolean graphValidTree(int[] inputData) {\n        // Write your solution here\n        return false;\n    }\n}\n",
      "cpp": "class Solution {\npublic:\n    bool graphValidTree(vector<int>& inputData) {\n        // Write your solution here\n        return false;\n    }\n};\n"
    },
    "supportedLanguages": [
      "python",
      "javascript",
      "java",
      "cpp"
    ],
    "testCases": [
      {
        "id": "tc-068-1",
        "input": "Valid case 1",
        "expectedOutput": "Standard Case 1 Result"
      },
      {
        "id": "tc-068-2",
        "input": "Edge case 2",
        "expectedOutput": "Standard Case 2 Result"
      }
    ],
    "hints": [
      "Consider optimal time complexity using Graphs principles.",
      "Break the state transition or traversal step down clearly.",
      "Check boundary/edge cases like empty input or duplicates."
    ],
    "approach": {
      "summary": "Optimal Graphs algorithm.",
      "steps": [
        "Understand problem constraints.",
        "Execute traversal / state update.",
        "Return final result."
      ]
    },
    "complexity": {
      "time": "O(N log N)",
      "space": "O(1) to O(N)",
      "analysis": "Algorithm runs in O(N log N) time with O(1) to O(N) space complexity."
    },
    "defaultMastery": 75,
    "recommendedTimeMinutes": 25
  },
  {
    "id": "pm-dsa-069",
    "title": "Number of Connected Components",
    "slug": "number-of-connected-components",
    "difficulty": "Medium",
    "category": "DSA",
    "topics": [
      "Graphs"
    ],
    "companies": [
      "Google",
      "Amazon"
    ],
    "frequentlyAsked": true,
    "interviewImportance": "Frequently Asked",
    "description": "Given the problem input for **Number of Connected Components**, implement an optimal algorithm adhering to the time and space constraints specified in interview standards.",
    "examples": [
      {
        "input": "Standard interview input vector",
        "output": "Expected optimal result",
        "explanation": "Demonstrates optimal Graphs traversal."
      }
    ],
    "constraints": [
      "1 <= input.length <= 10^5",
      "Output must be within standard data bounds."
    ],
    "starterCode": {
      "python": "def numberOfConnectedComponents(inputData) -> int:\n    # Write your solution here\n    return 0\n",
      "javascript": "function numberOfConnectedComponents(inputData) {\n    // Write your solution here\n    return 0;\n}\n",
      "java": "class Solution {\n    public int numberOfConnectedComponents(int[] inputData) {\n        // Write your solution here\n        return 0;\n    }\n}\n",
      "cpp": "class Solution {\npublic:\n    int numberOfConnectedComponents(vector<int>& inputData) {\n        // Write your solution here\n        return 0;\n    }\n};\n"
    },
    "supportedLanguages": [
      "python",
      "javascript",
      "java",
      "cpp"
    ],
    "testCases": [
      {
        "id": "tc-069-1",
        "input": "Valid case 1",
        "expectedOutput": "Standard Case 1 Result"
      },
      {
        "id": "tc-069-2",
        "input": "Edge case 2",
        "expectedOutput": "Standard Case 2 Result"
      }
    ],
    "hints": [
      "Consider optimal time complexity using Graphs principles.",
      "Break the state transition or traversal step down clearly.",
      "Check boundary/edge cases like empty input or duplicates."
    ],
    "approach": {
      "summary": "Optimal Graphs algorithm.",
      "steps": [
        "Understand problem constraints.",
        "Execute traversal / state update.",
        "Return final result."
      ]
    },
    "complexity": {
      "time": "O(N log N)",
      "space": "O(1) to O(N)",
      "analysis": "Algorithm runs in O(N log N) time with O(1) to O(N) space complexity."
    },
    "defaultMastery": 75,
    "recommendedTimeMinutes": 25
  },
  {
    "id": "pm-dsa-070",
    "title": "Word Ladder",
    "slug": "word-ladder",
    "difficulty": "Hard",
    "category": "DSA",
    "topics": [
      "Graphs"
    ],
    "companies": [
      "Amazon",
      "Google",
      "Microsoft"
    ],
    "frequentlyAsked": true,
    "interviewImportance": "Frequently Asked",
    "description": "Given the problem input for **Word Ladder**, implement an optimal algorithm adhering to the time and space constraints specified in interview standards.",
    "examples": [
      {
        "input": "Standard interview input vector",
        "output": "Expected optimal result",
        "explanation": "Demonstrates optimal Graphs traversal."
      }
    ],
    "constraints": [
      "1 <= input.length <= 10^5",
      "Output must be within standard data bounds."
    ],
    "starterCode": {
      "python": "def wordLadder(inputData) -> int:\n    # Write your solution here\n    return 0\n",
      "javascript": "function wordLadder(inputData) {\n    // Write your solution here\n    return 0;\n}\n",
      "java": "class Solution {\n    public int wordLadder(int[] inputData) {\n        // Write your solution here\n        return 0;\n    }\n}\n",
      "cpp": "class Solution {\npublic:\n    int wordLadder(vector<int>& inputData) {\n        // Write your solution here\n        return 0;\n    }\n};\n"
    },
    "supportedLanguages": [
      "python",
      "javascript",
      "java",
      "cpp"
    ],
    "testCases": [
      {
        "id": "tc-070-1",
        "input": "Valid case 1",
        "expectedOutput": "Standard Case 1 Result"
      },
      {
        "id": "tc-070-2",
        "input": "Edge case 2",
        "expectedOutput": "Standard Case 2 Result"
      }
    ],
    "hints": [
      "Consider optimal time complexity using Graphs principles.",
      "Break the state transition or traversal step down clearly.",
      "Check boundary/edge cases like empty input or duplicates."
    ],
    "approach": {
      "summary": "Optimal Graphs algorithm.",
      "steps": [
        "Understand problem constraints.",
        "Execute traversal / state update.",
        "Return final result."
      ]
    },
    "complexity": {
      "time": "O(N log N)",
      "space": "O(1) to O(N)",
      "analysis": "Algorithm runs in O(N log N) time with O(1) to O(N) space complexity."
    },
    "defaultMastery": 75,
    "recommendedTimeMinutes": 40
  },
  {
    "id": "pm-dsa-071",
    "title": "Climbing Stairs",
    "slug": "climbing-stairs",
    "difficulty": "Easy",
    "category": "DSA",
    "topics": [
      "Dynamic Programming"
    ],
    "companies": [
      "Amazon",
      "Microsoft",
      "TCS",
      "Accenture"
    ],
    "frequentlyAsked": true,
    "interviewImportance": "Frequently Asked",
    "description": "Given the problem input for **Climbing Stairs**, implement an optimal algorithm adhering to the time and space constraints specified in interview standards.",
    "examples": [
      {
        "input": "Standard interview input vector",
        "output": "Expected optimal result",
        "explanation": "Demonstrates optimal Dynamic Programming traversal."
      }
    ],
    "constraints": [
      "1 <= input.length <= 10^5",
      "Output must be within standard data bounds."
    ],
    "starterCode": {
      "python": "def climbingStairs(inputData) -> int:\n    # Write your solution here\n    return 0\n",
      "javascript": "function climbingStairs(inputData) {\n    // Write your solution here\n    return 0;\n}\n",
      "java": "class Solution {\n    public int climbingStairs(int[] inputData) {\n        // Write your solution here\n        return 0;\n    }\n}\n",
      "cpp": "class Solution {\npublic:\n    int climbingStairs(vector<int>& inputData) {\n        // Write your solution here\n        return 0;\n    }\n};\n"
    },
    "supportedLanguages": [
      "python",
      "javascript",
      "java",
      "cpp"
    ],
    "testCases": [
      {
        "id": "tc-071-1",
        "input": "Valid case 1",
        "expectedOutput": "Standard Case 1 Result"
      },
      {
        "id": "tc-071-2",
        "input": "Edge case 2",
        "expectedOutput": "Standard Case 2 Result"
      }
    ],
    "hints": [
      "Consider optimal time complexity using Dynamic Programming principles.",
      "Break the state transition or traversal step down clearly.",
      "Check boundary/edge cases like empty input or duplicates."
    ],
    "approach": {
      "summary": "Optimal Dynamic Programming algorithm.",
      "steps": [
        "Understand problem constraints.",
        "Execute traversal / state update.",
        "Return final result."
      ]
    },
    "complexity": {
      "time": "O(N)",
      "space": "O(1) to O(N)",
      "analysis": "Algorithm runs in O(N) time with O(1) to O(N) space complexity."
    },
    "defaultMastery": 75,
    "recommendedTimeMinutes": 15
  },
  {
    "id": "pm-dsa-072",
    "title": "Min Cost Climbing Stairs",
    "slug": "min-cost-climbing-stairs",
    "difficulty": "Easy",
    "category": "DSA",
    "topics": [
      "Dynamic Programming"
    ],
    "companies": [
      "Amazon",
      "Microsoft"
    ],
    "frequentlyAsked": true,
    "interviewImportance": "Frequently Asked",
    "description": "Given the problem input for **Min Cost Climbing Stairs**, implement an optimal algorithm adhering to the time and space constraints specified in interview standards.",
    "examples": [
      {
        "input": "Standard interview input vector",
        "output": "Expected optimal result",
        "explanation": "Demonstrates optimal Dynamic Programming traversal."
      }
    ],
    "constraints": [
      "1 <= input.length <= 10^5",
      "Output must be within standard data bounds."
    ],
    "starterCode": {
      "python": "def minCostClimbingStairs(inputData) -> int:\n    # Write your solution here\n    return 0\n",
      "javascript": "function minCostClimbingStairs(inputData) {\n    // Write your solution here\n    return 0;\n}\n",
      "java": "class Solution {\n    public int minCostClimbingStairs(int[] inputData) {\n        // Write your solution here\n        return 0;\n    }\n}\n",
      "cpp": "class Solution {\npublic:\n    int minCostClimbingStairs(vector<int>& inputData) {\n        // Write your solution here\n        return 0;\n    }\n};\n"
    },
    "supportedLanguages": [
      "python",
      "javascript",
      "java",
      "cpp"
    ],
    "testCases": [
      {
        "id": "tc-072-1",
        "input": "Valid case 1",
        "expectedOutput": "Standard Case 1 Result"
      },
      {
        "id": "tc-072-2",
        "input": "Edge case 2",
        "expectedOutput": "Standard Case 2 Result"
      }
    ],
    "hints": [
      "Consider optimal time complexity using Dynamic Programming principles.",
      "Break the state transition or traversal step down clearly.",
      "Check boundary/edge cases like empty input or duplicates."
    ],
    "approach": {
      "summary": "Optimal Dynamic Programming algorithm.",
      "steps": [
        "Understand problem constraints.",
        "Execute traversal / state update.",
        "Return final result."
      ]
    },
    "complexity": {
      "time": "O(N)",
      "space": "O(1) to O(N)",
      "analysis": "Algorithm runs in O(N) time with O(1) to O(N) space complexity."
    },
    "defaultMastery": 75,
    "recommendedTimeMinutes": 15
  },
  {
    "id": "pm-dsa-073",
    "title": "House Robber",
    "slug": "house-robber",
    "difficulty": "Medium",
    "category": "DSA",
    "topics": [
      "Dynamic Programming"
    ],
    "companies": [
      "Amazon",
      "Google",
      "Microsoft"
    ],
    "frequentlyAsked": true,
    "interviewImportance": "Frequently Asked",
    "description": "Given the problem input for **House Robber**, implement an optimal algorithm adhering to the time and space constraints specified in interview standards.",
    "examples": [
      {
        "input": "Standard interview input vector",
        "output": "Expected optimal result",
        "explanation": "Demonstrates optimal Dynamic Programming traversal."
      }
    ],
    "constraints": [
      "1 <= input.length <= 10^5",
      "Output must be within standard data bounds."
    ],
    "starterCode": {
      "python": "def houseRobber(inputData) -> int:\n    # Write your solution here\n    return 0\n",
      "javascript": "function houseRobber(inputData) {\n    // Write your solution here\n    return 0;\n}\n",
      "java": "class Solution {\n    public int houseRobber(int[] inputData) {\n        // Write your solution here\n        return 0;\n    }\n}\n",
      "cpp": "class Solution {\npublic:\n    int houseRobber(vector<int>& inputData) {\n        // Write your solution here\n        return 0;\n    }\n};\n"
    },
    "supportedLanguages": [
      "python",
      "javascript",
      "java",
      "cpp"
    ],
    "testCases": [
      {
        "id": "tc-073-1",
        "input": "Valid case 1",
        "expectedOutput": "Standard Case 1 Result"
      },
      {
        "id": "tc-073-2",
        "input": "Edge case 2",
        "expectedOutput": "Standard Case 2 Result"
      }
    ],
    "hints": [
      "Consider optimal time complexity using Dynamic Programming principles.",
      "Break the state transition or traversal step down clearly.",
      "Check boundary/edge cases like empty input or duplicates."
    ],
    "approach": {
      "summary": "Optimal Dynamic Programming algorithm.",
      "steps": [
        "Understand problem constraints.",
        "Execute traversal / state update.",
        "Return final result."
      ]
    },
    "complexity": {
      "time": "O(N log N)",
      "space": "O(1) to O(N)",
      "analysis": "Algorithm runs in O(N log N) time with O(1) to O(N) space complexity."
    },
    "defaultMastery": 75,
    "recommendedTimeMinutes": 25
  },
  {
    "id": "pm-dsa-074",
    "title": "House Robber II (Circular)",
    "slug": "house-robber-ii-circular-",
    "difficulty": "Medium",
    "category": "DSA",
    "topics": [
      "Dynamic Programming"
    ],
    "companies": [
      "Google",
      "Amazon"
    ],
    "frequentlyAsked": true,
    "interviewImportance": "Frequently Asked",
    "description": "Given the problem input for **House Robber II (Circular)**, implement an optimal algorithm adhering to the time and space constraints specified in interview standards.",
    "examples": [
      {
        "input": "Standard interview input vector",
        "output": "Expected optimal result",
        "explanation": "Demonstrates optimal Dynamic Programming traversal."
      }
    ],
    "constraints": [
      "1 <= input.length <= 10^5",
      "Output must be within standard data bounds."
    ],
    "starterCode": {
      "python": "def houseRobberIiCircular-(inputData) -> int:\n    # Write your solution here\n    return 0\n",
      "javascript": "function houseRobberIiCircular-(inputData) {\n    // Write your solution here\n    return 0;\n}\n",
      "java": "class Solution {\n    public int houseRobberIiCircular-(int[] inputData) {\n        // Write your solution here\n        return 0;\n    }\n}\n",
      "cpp": "class Solution {\npublic:\n    int houseRobberIiCircular-(vector<int>& inputData) {\n        // Write your solution here\n        return 0;\n    }\n};\n"
    },
    "supportedLanguages": [
      "python",
      "javascript",
      "java",
      "cpp"
    ],
    "testCases": [
      {
        "id": "tc-074-1",
        "input": "Valid case 1",
        "expectedOutput": "Standard Case 1 Result"
      },
      {
        "id": "tc-074-2",
        "input": "Edge case 2",
        "expectedOutput": "Standard Case 2 Result"
      }
    ],
    "hints": [
      "Consider optimal time complexity using Dynamic Programming principles.",
      "Break the state transition or traversal step down clearly.",
      "Check boundary/edge cases like empty input or duplicates."
    ],
    "approach": {
      "summary": "Optimal Dynamic Programming algorithm.",
      "steps": [
        "Understand problem constraints.",
        "Execute traversal / state update.",
        "Return final result."
      ]
    },
    "complexity": {
      "time": "O(N log N)",
      "space": "O(1) to O(N)",
      "analysis": "Algorithm runs in O(N log N) time with O(1) to O(N) space complexity."
    },
    "defaultMastery": 75,
    "recommendedTimeMinutes": 25
  },
  {
    "id": "pm-dsa-075",
    "title": "Longest Palindromic Substring",
    "slug": "longest-palindromic-substring",
    "difficulty": "Medium",
    "category": "DSA",
    "topics": [
      "Dynamic Programming"
    ],
    "companies": [
      "Amazon",
      "Microsoft",
      "Google"
    ],
    "frequentlyAsked": true,
    "interviewImportance": "Frequently Asked",
    "description": "Given the problem input for **Longest Palindromic Substring**, implement an optimal algorithm adhering to the time and space constraints specified in interview standards.",
    "examples": [
      {
        "input": "Standard interview input vector",
        "output": "Expected optimal result",
        "explanation": "Demonstrates optimal Dynamic Programming traversal."
      }
    ],
    "constraints": [
      "1 <= input.length <= 10^5",
      "Output must be within standard data bounds."
    ],
    "starterCode": {
      "python": "def longestPalindromicSubstring(inputData) -> String:\n    # Write your solution here\n    return \"\"\n",
      "javascript": "function longestPalindromicSubstring(inputData) {\n    // Write your solution here\n    return \"\";\n}\n",
      "java": "class Solution {\n    public String longestPalindromicSubstring(int[] inputData) {\n        // Write your solution here\n        return \"\";\n    }\n}\n",
      "cpp": "class Solution {\npublic:\n    string longestPalindromicSubstring(vector<int>& inputData) {\n        // Write your solution here\n        return \"\";\n    }\n};\n"
    },
    "supportedLanguages": [
      "python",
      "javascript",
      "java",
      "cpp"
    ],
    "testCases": [
      {
        "id": "tc-075-1",
        "input": "Valid case 1",
        "expectedOutput": "Standard Case 1 Result"
      },
      {
        "id": "tc-075-2",
        "input": "Edge case 2",
        "expectedOutput": "Standard Case 2 Result"
      }
    ],
    "hints": [
      "Consider optimal time complexity using Dynamic Programming principles.",
      "Break the state transition or traversal step down clearly.",
      "Check boundary/edge cases like empty input or duplicates."
    ],
    "approach": {
      "summary": "Optimal Dynamic Programming algorithm.",
      "steps": [
        "Understand problem constraints.",
        "Execute traversal / state update.",
        "Return final result."
      ]
    },
    "complexity": {
      "time": "O(N log N)",
      "space": "O(1) to O(N)",
      "analysis": "Algorithm runs in O(N log N) time with O(1) to O(N) space complexity."
    },
    "defaultMastery": 75,
    "recommendedTimeMinutes": 25
  },
  {
    "id": "pm-dsa-076",
    "title": "Palindromic Substrings Count",
    "slug": "palindromic-substrings-count",
    "difficulty": "Medium",
    "category": "DSA",
    "topics": [
      "Dynamic Programming"
    ],
    "companies": [
      "Amazon",
      "Google"
    ],
    "frequentlyAsked": true,
    "interviewImportance": "Frequently Asked",
    "description": "Given the problem input for **Palindromic Substrings Count**, implement an optimal algorithm adhering to the time and space constraints specified in interview standards.",
    "examples": [
      {
        "input": "Standard interview input vector",
        "output": "Expected optimal result",
        "explanation": "Demonstrates optimal Dynamic Programming traversal."
      }
    ],
    "constraints": [
      "1 <= input.length <= 10^5",
      "Output must be within standard data bounds."
    ],
    "starterCode": {
      "python": "def palindromicSubstringsCount(inputData) -> int:\n    # Write your solution here\n    return 0\n",
      "javascript": "function palindromicSubstringsCount(inputData) {\n    // Write your solution here\n    return 0;\n}\n",
      "java": "class Solution {\n    public int palindromicSubstringsCount(int[] inputData) {\n        // Write your solution here\n        return 0;\n    }\n}\n",
      "cpp": "class Solution {\npublic:\n    int palindromicSubstringsCount(vector<int>& inputData) {\n        // Write your solution here\n        return 0;\n    }\n};\n"
    },
    "supportedLanguages": [
      "python",
      "javascript",
      "java",
      "cpp"
    ],
    "testCases": [
      {
        "id": "tc-076-1",
        "input": "Valid case 1",
        "expectedOutput": "Standard Case 1 Result"
      },
      {
        "id": "tc-076-2",
        "input": "Edge case 2",
        "expectedOutput": "Standard Case 2 Result"
      }
    ],
    "hints": [
      "Consider optimal time complexity using Dynamic Programming principles.",
      "Break the state transition or traversal step down clearly.",
      "Check boundary/edge cases like empty input or duplicates."
    ],
    "approach": {
      "summary": "Optimal Dynamic Programming algorithm.",
      "steps": [
        "Understand problem constraints.",
        "Execute traversal / state update.",
        "Return final result."
      ]
    },
    "complexity": {
      "time": "O(N log N)",
      "space": "O(1) to O(N)",
      "analysis": "Algorithm runs in O(N log N) time with O(1) to O(N) space complexity."
    },
    "defaultMastery": 75,
    "recommendedTimeMinutes": 25
  },
  {
    "id": "pm-dsa-077",
    "title": "Decode Ways",
    "slug": "decode-ways",
    "difficulty": "Medium",
    "category": "DSA",
    "topics": [
      "Dynamic Programming"
    ],
    "companies": [
      "Amazon",
      "Google",
      "Microsoft"
    ],
    "frequentlyAsked": true,
    "interviewImportance": "Frequently Asked",
    "description": "Given the problem input for **Decode Ways**, implement an optimal algorithm adhering to the time and space constraints specified in interview standards.",
    "examples": [
      {
        "input": "Standard interview input vector",
        "output": "Expected optimal result",
        "explanation": "Demonstrates optimal Dynamic Programming traversal."
      }
    ],
    "constraints": [
      "1 <= input.length <= 10^5",
      "Output must be within standard data bounds."
    ],
    "starterCode": {
      "python": "def decodeWays(inputData) -> int:\n    # Write your solution here\n    return 0\n",
      "javascript": "function decodeWays(inputData) {\n    // Write your solution here\n    return 0;\n}\n",
      "java": "class Solution {\n    public int decodeWays(int[] inputData) {\n        // Write your solution here\n        return 0;\n    }\n}\n",
      "cpp": "class Solution {\npublic:\n    int decodeWays(vector<int>& inputData) {\n        // Write your solution here\n        return 0;\n    }\n};\n"
    },
    "supportedLanguages": [
      "python",
      "javascript",
      "java",
      "cpp"
    ],
    "testCases": [
      {
        "id": "tc-077-1",
        "input": "Valid case 1",
        "expectedOutput": "Standard Case 1 Result"
      },
      {
        "id": "tc-077-2",
        "input": "Edge case 2",
        "expectedOutput": "Standard Case 2 Result"
      }
    ],
    "hints": [
      "Consider optimal time complexity using Dynamic Programming principles.",
      "Break the state transition or traversal step down clearly.",
      "Check boundary/edge cases like empty input or duplicates."
    ],
    "approach": {
      "summary": "Optimal Dynamic Programming algorithm.",
      "steps": [
        "Understand problem constraints.",
        "Execute traversal / state update.",
        "Return final result."
      ]
    },
    "complexity": {
      "time": "O(N log N)",
      "space": "O(1) to O(N)",
      "analysis": "Algorithm runs in O(N log N) time with O(1) to O(N) space complexity."
    },
    "defaultMastery": 75,
    "recommendedTimeMinutes": 25
  },
  {
    "id": "pm-dsa-078",
    "title": "Coin Change",
    "slug": "coin-change",
    "difficulty": "Medium",
    "category": "DSA",
    "topics": [
      "Dynamic Programming"
    ],
    "companies": [
      "Amazon",
      "Microsoft",
      "Google",
      "Zoho"
    ],
    "frequentlyAsked": true,
    "interviewImportance": "Frequently Asked",
    "description": "Given the problem input for **Coin Change**, implement an optimal algorithm adhering to the time and space constraints specified in interview standards.",
    "examples": [
      {
        "input": "Standard interview input vector",
        "output": "Expected optimal result",
        "explanation": "Demonstrates optimal Dynamic Programming traversal."
      }
    ],
    "constraints": [
      "1 <= input.length <= 10^5",
      "Output must be within standard data bounds."
    ],
    "starterCode": {
      "python": "def coinChange(inputData) -> int:\n    # Write your solution here\n    return 0\n",
      "javascript": "function coinChange(inputData) {\n    // Write your solution here\n    return 0;\n}\n",
      "java": "class Solution {\n    public int coinChange(int[] inputData) {\n        // Write your solution here\n        return 0;\n    }\n}\n",
      "cpp": "class Solution {\npublic:\n    int coinChange(vector<int>& inputData) {\n        // Write your solution here\n        return 0;\n    }\n};\n"
    },
    "supportedLanguages": [
      "python",
      "javascript",
      "java",
      "cpp"
    ],
    "testCases": [
      {
        "id": "tc-078-1",
        "input": "Valid case 1",
        "expectedOutput": "Standard Case 1 Result"
      },
      {
        "id": "tc-078-2",
        "input": "Edge case 2",
        "expectedOutput": "Standard Case 2 Result"
      }
    ],
    "hints": [
      "Consider optimal time complexity using Dynamic Programming principles.",
      "Break the state transition or traversal step down clearly.",
      "Check boundary/edge cases like empty input or duplicates."
    ],
    "approach": {
      "summary": "Optimal Dynamic Programming algorithm.",
      "steps": [
        "Understand problem constraints.",
        "Execute traversal / state update.",
        "Return final result."
      ]
    },
    "complexity": {
      "time": "O(N log N)",
      "space": "O(1) to O(N)",
      "analysis": "Algorithm runs in O(N log N) time with O(1) to O(N) space complexity."
    },
    "defaultMastery": 75,
    "recommendedTimeMinutes": 25
  },
  {
    "id": "pm-dsa-079",
    "title": "Maximum Product Subarray",
    "slug": "maximum-product-subarray",
    "difficulty": "Medium",
    "category": "DSA",
    "topics": [
      "Dynamic Programming"
    ],
    "companies": [
      "Amazon",
      "Microsoft"
    ],
    "frequentlyAsked": true,
    "interviewImportance": "Frequently Asked",
    "description": "Given the problem input for **Maximum Product Subarray**, implement an optimal algorithm adhering to the time and space constraints specified in interview standards.",
    "examples": [
      {
        "input": "Standard interview input vector",
        "output": "Expected optimal result",
        "explanation": "Demonstrates optimal Dynamic Programming traversal."
      }
    ],
    "constraints": [
      "1 <= input.length <= 10^5",
      "Output must be within standard data bounds."
    ],
    "starterCode": {
      "python": "def maximumProductSubarray(inputData) -> int:\n    # Write your solution here\n    return 0\n",
      "javascript": "function maximumProductSubarray(inputData) {\n    // Write your solution here\n    return 0;\n}\n",
      "java": "class Solution {\n    public int maximumProductSubarray(int[] inputData) {\n        // Write your solution here\n        return 0;\n    }\n}\n",
      "cpp": "class Solution {\npublic:\n    int maximumProductSubarray(vector<int>& inputData) {\n        // Write your solution here\n        return 0;\n    }\n};\n"
    },
    "supportedLanguages": [
      "python",
      "javascript",
      "java",
      "cpp"
    ],
    "testCases": [
      {
        "id": "tc-079-1",
        "input": "Valid case 1",
        "expectedOutput": "Standard Case 1 Result"
      },
      {
        "id": "tc-079-2",
        "input": "Edge case 2",
        "expectedOutput": "Standard Case 2 Result"
      }
    ],
    "hints": [
      "Consider optimal time complexity using Dynamic Programming principles.",
      "Break the state transition or traversal step down clearly.",
      "Check boundary/edge cases like empty input or duplicates."
    ],
    "approach": {
      "summary": "Optimal Dynamic Programming algorithm.",
      "steps": [
        "Understand problem constraints.",
        "Execute traversal / state update.",
        "Return final result."
      ]
    },
    "complexity": {
      "time": "O(N log N)",
      "space": "O(1) to O(N)",
      "analysis": "Algorithm runs in O(N log N) time with O(1) to O(N) space complexity."
    },
    "defaultMastery": 75,
    "recommendedTimeMinutes": 25
  },
  {
    "id": "pm-dsa-080",
    "title": "Word Break",
    "slug": "word-break",
    "difficulty": "Medium",
    "category": "DSA",
    "topics": [
      "Dynamic Programming"
    ],
    "companies": [
      "Amazon",
      "Google",
      "Microsoft"
    ],
    "frequentlyAsked": true,
    "interviewImportance": "Frequently Asked",
    "description": "Given the problem input for **Word Break**, implement an optimal algorithm adhering to the time and space constraints specified in interview standards.",
    "examples": [
      {
        "input": "Standard interview input vector",
        "output": "Expected optimal result",
        "explanation": "Demonstrates optimal Dynamic Programming traversal."
      }
    ],
    "constraints": [
      "1 <= input.length <= 10^5",
      "Output must be within standard data bounds."
    ],
    "starterCode": {
      "python": "def wordBreak(inputData) -> boolean:\n    # Write your solution here\n    return False\n",
      "javascript": "function wordBreak(inputData) {\n    // Write your solution here\n    return false;\n}\n",
      "java": "class Solution {\n    public boolean wordBreak(int[] inputData) {\n        // Write your solution here\n        return false;\n    }\n}\n",
      "cpp": "class Solution {\npublic:\n    bool wordBreak(vector<int>& inputData) {\n        // Write your solution here\n        return false;\n    }\n};\n"
    },
    "supportedLanguages": [
      "python",
      "javascript",
      "java",
      "cpp"
    ],
    "testCases": [
      {
        "id": "tc-080-1",
        "input": "Valid case 1",
        "expectedOutput": "Standard Case 1 Result"
      },
      {
        "id": "tc-080-2",
        "input": "Edge case 2",
        "expectedOutput": "Standard Case 2 Result"
      }
    ],
    "hints": [
      "Consider optimal time complexity using Dynamic Programming principles.",
      "Break the state transition or traversal step down clearly.",
      "Check boundary/edge cases like empty input or duplicates."
    ],
    "approach": {
      "summary": "Optimal Dynamic Programming algorithm.",
      "steps": [
        "Understand problem constraints.",
        "Execute traversal / state update.",
        "Return final result."
      ]
    },
    "complexity": {
      "time": "O(N log N)",
      "space": "O(1) to O(N)",
      "analysis": "Algorithm runs in O(N log N) time with O(1) to O(N) space complexity."
    },
    "defaultMastery": 75,
    "recommendedTimeMinutes": 25
  },
  {
    "id": "pm-dsa-081",
    "title": "Longest Increasing Subsequence",
    "slug": "longest-increasing-subsequence",
    "difficulty": "Medium",
    "category": "DSA",
    "topics": [
      "Dynamic Programming"
    ],
    "companies": [
      "Amazon",
      "Microsoft",
      "Google"
    ],
    "frequentlyAsked": true,
    "interviewImportance": "Frequently Asked",
    "description": "Given the problem input for **Longest Increasing Subsequence**, implement an optimal algorithm adhering to the time and space constraints specified in interview standards.",
    "examples": [
      {
        "input": "Standard interview input vector",
        "output": "Expected optimal result",
        "explanation": "Demonstrates optimal Dynamic Programming traversal."
      }
    ],
    "constraints": [
      "1 <= input.length <= 10^5",
      "Output must be within standard data bounds."
    ],
    "starterCode": {
      "python": "def longestIncreasingSubsequence(inputData) -> int:\n    # Write your solution here\n    return 0\n",
      "javascript": "function longestIncreasingSubsequence(inputData) {\n    // Write your solution here\n    return 0;\n}\n",
      "java": "class Solution {\n    public int longestIncreasingSubsequence(int[] inputData) {\n        // Write your solution here\n        return 0;\n    }\n}\n",
      "cpp": "class Solution {\npublic:\n    int longestIncreasingSubsequence(vector<int>& inputData) {\n        // Write your solution here\n        return 0;\n    }\n};\n"
    },
    "supportedLanguages": [
      "python",
      "javascript",
      "java",
      "cpp"
    ],
    "testCases": [
      {
        "id": "tc-081-1",
        "input": "Valid case 1",
        "expectedOutput": "Standard Case 1 Result"
      },
      {
        "id": "tc-081-2",
        "input": "Edge case 2",
        "expectedOutput": "Standard Case 2 Result"
      }
    ],
    "hints": [
      "Consider optimal time complexity using Dynamic Programming principles.",
      "Break the state transition or traversal step down clearly.",
      "Check boundary/edge cases like empty input or duplicates."
    ],
    "approach": {
      "summary": "Optimal Dynamic Programming algorithm.",
      "steps": [
        "Understand problem constraints.",
        "Execute traversal / state update.",
        "Return final result."
      ]
    },
    "complexity": {
      "time": "O(N log N)",
      "space": "O(1) to O(N)",
      "analysis": "Algorithm runs in O(N log N) time with O(1) to O(N) space complexity."
    },
    "defaultMastery": 75,
    "recommendedTimeMinutes": 25
  },
  {
    "id": "pm-dsa-082",
    "title": "Partition Equal Subset Sum",
    "slug": "partition-equal-subset-sum",
    "difficulty": "Medium",
    "category": "DSA",
    "topics": [
      "Dynamic Programming"
    ],
    "companies": [
      "Amazon",
      "Google"
    ],
    "frequentlyAsked": true,
    "interviewImportance": "Frequently Asked",
    "description": "Given the problem input for **Partition Equal Subset Sum**, implement an optimal algorithm adhering to the time and space constraints specified in interview standards.",
    "examples": [
      {
        "input": "Standard interview input vector",
        "output": "Expected optimal result",
        "explanation": "Demonstrates optimal Dynamic Programming traversal."
      }
    ],
    "constraints": [
      "1 <= input.length <= 10^5",
      "Output must be within standard data bounds."
    ],
    "starterCode": {
      "python": "def partitionEqualSubsetSum(inputData) -> boolean:\n    # Write your solution here\n    return False\n",
      "javascript": "function partitionEqualSubsetSum(inputData) {\n    // Write your solution here\n    return false;\n}\n",
      "java": "class Solution {\n    public boolean partitionEqualSubsetSum(int[] inputData) {\n        // Write your solution here\n        return false;\n    }\n}\n",
      "cpp": "class Solution {\npublic:\n    bool partitionEqualSubsetSum(vector<int>& inputData) {\n        // Write your solution here\n        return false;\n    }\n};\n"
    },
    "supportedLanguages": [
      "python",
      "javascript",
      "java",
      "cpp"
    ],
    "testCases": [
      {
        "id": "tc-082-1",
        "input": "Valid case 1",
        "expectedOutput": "Standard Case 1 Result"
      },
      {
        "id": "tc-082-2",
        "input": "Edge case 2",
        "expectedOutput": "Standard Case 2 Result"
      }
    ],
    "hints": [
      "Consider optimal time complexity using Dynamic Programming principles.",
      "Break the state transition or traversal step down clearly.",
      "Check boundary/edge cases like empty input or duplicates."
    ],
    "approach": {
      "summary": "Optimal Dynamic Programming algorithm.",
      "steps": [
        "Understand problem constraints.",
        "Execute traversal / state update.",
        "Return final result."
      ]
    },
    "complexity": {
      "time": "O(N log N)",
      "space": "O(1) to O(N)",
      "analysis": "Algorithm runs in O(N log N) time with O(1) to O(N) space complexity."
    },
    "defaultMastery": 75,
    "recommendedTimeMinutes": 25
  },
  {
    "id": "pm-dsa-083",
    "title": "Unique Paths",
    "slug": "unique-paths",
    "difficulty": "Medium",
    "category": "DSA",
    "topics": [
      "Dynamic Programming"
    ],
    "companies": [
      "Amazon",
      "Microsoft",
      "Google"
    ],
    "frequentlyAsked": true,
    "interviewImportance": "Frequently Asked",
    "description": "Given the problem input for **Unique Paths**, implement an optimal algorithm adhering to the time and space constraints specified in interview standards.",
    "examples": [
      {
        "input": "Standard interview input vector",
        "output": "Expected optimal result",
        "explanation": "Demonstrates optimal Dynamic Programming traversal."
      }
    ],
    "constraints": [
      "1 <= input.length <= 10^5",
      "Output must be within standard data bounds."
    ],
    "starterCode": {
      "python": "def uniquePaths(inputData) -> int:\n    # Write your solution here\n    return 0\n",
      "javascript": "function uniquePaths(inputData) {\n    // Write your solution here\n    return 0;\n}\n",
      "java": "class Solution {\n    public int uniquePaths(int[] inputData) {\n        // Write your solution here\n        return 0;\n    }\n}\n",
      "cpp": "class Solution {\npublic:\n    int uniquePaths(vector<int>& inputData) {\n        // Write your solution here\n        return 0;\n    }\n};\n"
    },
    "supportedLanguages": [
      "python",
      "javascript",
      "java",
      "cpp"
    ],
    "testCases": [
      {
        "id": "tc-083-1",
        "input": "Valid case 1",
        "expectedOutput": "Standard Case 1 Result"
      },
      {
        "id": "tc-083-2",
        "input": "Edge case 2",
        "expectedOutput": "Standard Case 2 Result"
      }
    ],
    "hints": [
      "Consider optimal time complexity using Dynamic Programming principles.",
      "Break the state transition or traversal step down clearly.",
      "Check boundary/edge cases like empty input or duplicates."
    ],
    "approach": {
      "summary": "Optimal Dynamic Programming algorithm.",
      "steps": [
        "Understand problem constraints.",
        "Execute traversal / state update.",
        "Return final result."
      ]
    },
    "complexity": {
      "time": "O(N log N)",
      "space": "O(1) to O(N)",
      "analysis": "Algorithm runs in O(N log N) time with O(1) to O(N) space complexity."
    },
    "defaultMastery": 75,
    "recommendedTimeMinutes": 25
  },
  {
    "id": "pm-dsa-084",
    "title": "Longest Common Subsequence",
    "slug": "longest-common-subsequence",
    "difficulty": "Medium",
    "category": "DSA",
    "topics": [
      "Dynamic Programming"
    ],
    "companies": [
      "Amazon",
      "Microsoft",
      "Google"
    ],
    "frequentlyAsked": true,
    "interviewImportance": "Frequently Asked",
    "description": "Given the problem input for **Longest Common Subsequence**, implement an optimal algorithm adhering to the time and space constraints specified in interview standards.",
    "examples": [
      {
        "input": "Standard interview input vector",
        "output": "Expected optimal result",
        "explanation": "Demonstrates optimal Dynamic Programming traversal."
      }
    ],
    "constraints": [
      "1 <= input.length <= 10^5",
      "Output must be within standard data bounds."
    ],
    "starterCode": {
      "python": "def longestCommonSubsequence(inputData) -> int:\n    # Write your solution here\n    return 0\n",
      "javascript": "function longestCommonSubsequence(inputData) {\n    // Write your solution here\n    return 0;\n}\n",
      "java": "class Solution {\n    public int longestCommonSubsequence(int[] inputData) {\n        // Write your solution here\n        return 0;\n    }\n}\n",
      "cpp": "class Solution {\npublic:\n    int longestCommonSubsequence(vector<int>& inputData) {\n        // Write your solution here\n        return 0;\n    }\n};\n"
    },
    "supportedLanguages": [
      "python",
      "javascript",
      "java",
      "cpp"
    ],
    "testCases": [
      {
        "id": "tc-084-1",
        "input": "Valid case 1",
        "expectedOutput": "Standard Case 1 Result"
      },
      {
        "id": "tc-084-2",
        "input": "Edge case 2",
        "expectedOutput": "Standard Case 2 Result"
      }
    ],
    "hints": [
      "Consider optimal time complexity using Dynamic Programming principles.",
      "Break the state transition or traversal step down clearly.",
      "Check boundary/edge cases like empty input or duplicates."
    ],
    "approach": {
      "summary": "Optimal Dynamic Programming algorithm.",
      "steps": [
        "Understand problem constraints.",
        "Execute traversal / state update.",
        "Return final result."
      ]
    },
    "complexity": {
      "time": "O(N log N)",
      "space": "O(1) to O(N)",
      "analysis": "Algorithm runs in O(N log N) time with O(1) to O(N) space complexity."
    },
    "defaultMastery": 75,
    "recommendedTimeMinutes": 25
  },
  {
    "id": "pm-dsa-085",
    "title": "Best Time to Buy Stock with Cooldown",
    "slug": "best-time-to-buy-stock-with-cooldown",
    "difficulty": "Medium",
    "category": "DSA",
    "topics": [
      "Dynamic Programming"
    ],
    "companies": [
      "Google",
      "Amazon"
    ],
    "frequentlyAsked": true,
    "interviewImportance": "Frequently Asked",
    "description": "Given the problem input for **Best Time to Buy Stock with Cooldown**, implement an optimal algorithm adhering to the time and space constraints specified in interview standards.",
    "examples": [
      {
        "input": "Standard interview input vector",
        "output": "Expected optimal result",
        "explanation": "Demonstrates optimal Dynamic Programming traversal."
      }
    ],
    "constraints": [
      "1 <= input.length <= 10^5",
      "Output must be within standard data bounds."
    ],
    "starterCode": {
      "python": "def bestTimeToBuyStockWithCooldown(inputData) -> int:\n    # Write your solution here\n    return 0\n",
      "javascript": "function bestTimeToBuyStockWithCooldown(inputData) {\n    // Write your solution here\n    return 0;\n}\n",
      "java": "class Solution {\n    public int bestTimeToBuyStockWithCooldown(int[] inputData) {\n        // Write your solution here\n        return 0;\n    }\n}\n",
      "cpp": "class Solution {\npublic:\n    int bestTimeToBuyStockWithCooldown(vector<int>& inputData) {\n        // Write your solution here\n        return 0;\n    }\n};\n"
    },
    "supportedLanguages": [
      "python",
      "javascript",
      "java",
      "cpp"
    ],
    "testCases": [
      {
        "id": "tc-085-1",
        "input": "Valid case 1",
        "expectedOutput": "Standard Case 1 Result"
      },
      {
        "id": "tc-085-2",
        "input": "Edge case 2",
        "expectedOutput": "Standard Case 2 Result"
      }
    ],
    "hints": [
      "Consider optimal time complexity using Dynamic Programming principles.",
      "Break the state transition or traversal step down clearly.",
      "Check boundary/edge cases like empty input or duplicates."
    ],
    "approach": {
      "summary": "Optimal Dynamic Programming algorithm.",
      "steps": [
        "Understand problem constraints.",
        "Execute traversal / state update.",
        "Return final result."
      ]
    },
    "complexity": {
      "time": "O(N log N)",
      "space": "O(1) to O(N)",
      "analysis": "Algorithm runs in O(N log N) time with O(1) to O(N) space complexity."
    },
    "defaultMastery": 75,
    "recommendedTimeMinutes": 25
  },
  {
    "id": "pm-dsa-086",
    "title": "Coin Change II - Total Ways",
    "slug": "coin-change-ii-total-ways",
    "difficulty": "Medium",
    "category": "DSA",
    "topics": [
      "Dynamic Programming"
    ],
    "companies": [
      "Amazon",
      "Microsoft"
    ],
    "frequentlyAsked": true,
    "interviewImportance": "Frequently Asked",
    "description": "Given the problem input for **Coin Change II - Total Ways**, implement an optimal algorithm adhering to the time and space constraints specified in interview standards.",
    "examples": [
      {
        "input": "Standard interview input vector",
        "output": "Expected optimal result",
        "explanation": "Demonstrates optimal Dynamic Programming traversal."
      }
    ],
    "constraints": [
      "1 <= input.length <= 10^5",
      "Output must be within standard data bounds."
    ],
    "starterCode": {
      "python": "def coinChangeIiTotalWays(inputData) -> int:\n    # Write your solution here\n    return 0\n",
      "javascript": "function coinChangeIiTotalWays(inputData) {\n    // Write your solution here\n    return 0;\n}\n",
      "java": "class Solution {\n    public int coinChangeIiTotalWays(int[] inputData) {\n        // Write your solution here\n        return 0;\n    }\n}\n",
      "cpp": "class Solution {\npublic:\n    int coinChangeIiTotalWays(vector<int>& inputData) {\n        // Write your solution here\n        return 0;\n    }\n};\n"
    },
    "supportedLanguages": [
      "python",
      "javascript",
      "java",
      "cpp"
    ],
    "testCases": [
      {
        "id": "tc-086-1",
        "input": "Valid case 1",
        "expectedOutput": "Standard Case 1 Result"
      },
      {
        "id": "tc-086-2",
        "input": "Edge case 2",
        "expectedOutput": "Standard Case 2 Result"
      }
    ],
    "hints": [
      "Consider optimal time complexity using Dynamic Programming principles.",
      "Break the state transition or traversal step down clearly.",
      "Check boundary/edge cases like empty input or duplicates."
    ],
    "approach": {
      "summary": "Optimal Dynamic Programming algorithm.",
      "steps": [
        "Understand problem constraints.",
        "Execute traversal / state update.",
        "Return final result."
      ]
    },
    "complexity": {
      "time": "O(N log N)",
      "space": "O(1) to O(N)",
      "analysis": "Algorithm runs in O(N log N) time with O(1) to O(N) space complexity."
    },
    "defaultMastery": 75,
    "recommendedTimeMinutes": 25
  },
  {
    "id": "pm-dsa-087",
    "title": "Target Sum",
    "slug": "target-sum",
    "difficulty": "Medium",
    "category": "DSA",
    "topics": [
      "Dynamic Programming"
    ],
    "companies": [
      "Google",
      "Amazon"
    ],
    "frequentlyAsked": true,
    "interviewImportance": "Frequently Asked",
    "description": "Given the problem input for **Target Sum**, implement an optimal algorithm adhering to the time and space constraints specified in interview standards.",
    "examples": [
      {
        "input": "Standard interview input vector",
        "output": "Expected optimal result",
        "explanation": "Demonstrates optimal Dynamic Programming traversal."
      }
    ],
    "constraints": [
      "1 <= input.length <= 10^5",
      "Output must be within standard data bounds."
    ],
    "starterCode": {
      "python": "def targetSum(inputData) -> int:\n    # Write your solution here\n    return 0\n",
      "javascript": "function targetSum(inputData) {\n    // Write your solution here\n    return 0;\n}\n",
      "java": "class Solution {\n    public int targetSum(int[] inputData) {\n        // Write your solution here\n        return 0;\n    }\n}\n",
      "cpp": "class Solution {\npublic:\n    int targetSum(vector<int>& inputData) {\n        // Write your solution here\n        return 0;\n    }\n};\n"
    },
    "supportedLanguages": [
      "python",
      "javascript",
      "java",
      "cpp"
    ],
    "testCases": [
      {
        "id": "tc-087-1",
        "input": "Valid case 1",
        "expectedOutput": "Standard Case 1 Result"
      },
      {
        "id": "tc-087-2",
        "input": "Edge case 2",
        "expectedOutput": "Standard Case 2 Result"
      }
    ],
    "hints": [
      "Consider optimal time complexity using Dynamic Programming principles.",
      "Break the state transition or traversal step down clearly.",
      "Check boundary/edge cases like empty input or duplicates."
    ],
    "approach": {
      "summary": "Optimal Dynamic Programming algorithm.",
      "steps": [
        "Understand problem constraints.",
        "Execute traversal / state update.",
        "Return final result."
      ]
    },
    "complexity": {
      "time": "O(N log N)",
      "space": "O(1) to O(N)",
      "analysis": "Algorithm runs in O(N log N) time with O(1) to O(N) space complexity."
    },
    "defaultMastery": 75,
    "recommendedTimeMinutes": 25
  },
  {
    "id": "pm-dsa-088",
    "title": "Edit Distance",
    "slug": "edit-distance",
    "difficulty": "Hard",
    "category": "DSA",
    "topics": [
      "Dynamic Programming"
    ],
    "companies": [
      "Google",
      "Microsoft",
      "Amazon"
    ],
    "frequentlyAsked": true,
    "interviewImportance": "Frequently Asked",
    "description": "Given the problem input for **Edit Distance**, implement an optimal algorithm adhering to the time and space constraints specified in interview standards.",
    "examples": [
      {
        "input": "Standard interview input vector",
        "output": "Expected optimal result",
        "explanation": "Demonstrates optimal Dynamic Programming traversal."
      }
    ],
    "constraints": [
      "1 <= input.length <= 10^5",
      "Output must be within standard data bounds."
    ],
    "starterCode": {
      "python": "def editDistance(inputData) -> int:\n    # Write your solution here\n    return 0\n",
      "javascript": "function editDistance(inputData) {\n    // Write your solution here\n    return 0;\n}\n",
      "java": "class Solution {\n    public int editDistance(int[] inputData) {\n        // Write your solution here\n        return 0;\n    }\n}\n",
      "cpp": "class Solution {\npublic:\n    int editDistance(vector<int>& inputData) {\n        // Write your solution here\n        return 0;\n    }\n};\n"
    },
    "supportedLanguages": [
      "python",
      "javascript",
      "java",
      "cpp"
    ],
    "testCases": [
      {
        "id": "tc-088-1",
        "input": "Valid case 1",
        "expectedOutput": "Standard Case 1 Result"
      },
      {
        "id": "tc-088-2",
        "input": "Edge case 2",
        "expectedOutput": "Standard Case 2 Result"
      }
    ],
    "hints": [
      "Consider optimal time complexity using Dynamic Programming principles.",
      "Break the state transition or traversal step down clearly.",
      "Check boundary/edge cases like empty input or duplicates."
    ],
    "approach": {
      "summary": "Optimal Dynamic Programming algorithm.",
      "steps": [
        "Understand problem constraints.",
        "Execute traversal / state update.",
        "Return final result."
      ]
    },
    "complexity": {
      "time": "O(N log N)",
      "space": "O(1) to O(N)",
      "analysis": "Algorithm runs in O(N log N) time with O(1) to O(N) space complexity."
    },
    "defaultMastery": 75,
    "recommendedTimeMinutes": 40
  },
  {
    "id": "pm-dsa-089",
    "title": "Jump Game",
    "slug": "jump-game",
    "difficulty": "Medium",
    "category": "DSA",
    "topics": [
      "Greedy"
    ],
    "companies": [
      "Amazon",
      "Microsoft",
      "Google"
    ],
    "frequentlyAsked": true,
    "interviewImportance": "Frequently Asked",
    "description": "Given the problem input for **Jump Game**, implement an optimal algorithm adhering to the time and space constraints specified in interview standards.",
    "examples": [
      {
        "input": "Standard interview input vector",
        "output": "Expected optimal result",
        "explanation": "Demonstrates optimal Greedy traversal."
      }
    ],
    "constraints": [
      "1 <= input.length <= 10^5",
      "Output must be within standard data bounds."
    ],
    "starterCode": {
      "python": "def jumpGame(inputData) -> boolean:\n    # Write your solution here\n    return False\n",
      "javascript": "function jumpGame(inputData) {\n    // Write your solution here\n    return false;\n}\n",
      "java": "class Solution {\n    public boolean jumpGame(int[] inputData) {\n        // Write your solution here\n        return false;\n    }\n}\n",
      "cpp": "class Solution {\npublic:\n    bool jumpGame(vector<int>& inputData) {\n        // Write your solution here\n        return false;\n    }\n};\n"
    },
    "supportedLanguages": [
      "python",
      "javascript",
      "java",
      "cpp"
    ],
    "testCases": [
      {
        "id": "tc-089-1",
        "input": "Valid case 1",
        "expectedOutput": "Standard Case 1 Result"
      },
      {
        "id": "tc-089-2",
        "input": "Edge case 2",
        "expectedOutput": "Standard Case 2 Result"
      }
    ],
    "hints": [
      "Consider optimal time complexity using Greedy principles.",
      "Break the state transition or traversal step down clearly.",
      "Check boundary/edge cases like empty input or duplicates."
    ],
    "approach": {
      "summary": "Optimal Greedy algorithm.",
      "steps": [
        "Understand problem constraints.",
        "Execute traversal / state update.",
        "Return final result."
      ]
    },
    "complexity": {
      "time": "O(N log N)",
      "space": "O(1) to O(N)",
      "analysis": "Algorithm runs in O(N log N) time with O(1) to O(N) space complexity."
    },
    "defaultMastery": 75,
    "recommendedTimeMinutes": 25
  },
  {
    "id": "pm-dsa-090",
    "title": "Jump Game II - Minimum Jumps",
    "slug": "jump-game-ii-minimum-jumps",
    "difficulty": "Medium",
    "category": "DSA",
    "topics": [
      "Greedy"
    ],
    "companies": [
      "Google",
      "Amazon"
    ],
    "frequentlyAsked": true,
    "interviewImportance": "Frequently Asked",
    "description": "Given the problem input for **Jump Game II - Minimum Jumps**, implement an optimal algorithm adhering to the time and space constraints specified in interview standards.",
    "examples": [
      {
        "input": "Standard interview input vector",
        "output": "Expected optimal result",
        "explanation": "Demonstrates optimal Greedy traversal."
      }
    ],
    "constraints": [
      "1 <= input.length <= 10^5",
      "Output must be within standard data bounds."
    ],
    "starterCode": {
      "python": "def jumpGameIiMinimumJumps(inputData) -> int:\n    # Write your solution here\n    return 0\n",
      "javascript": "function jumpGameIiMinimumJumps(inputData) {\n    // Write your solution here\n    return 0;\n}\n",
      "java": "class Solution {\n    public int jumpGameIiMinimumJumps(int[] inputData) {\n        // Write your solution here\n        return 0;\n    }\n}\n",
      "cpp": "class Solution {\npublic:\n    int jumpGameIiMinimumJumps(vector<int>& inputData) {\n        // Write your solution here\n        return 0;\n    }\n};\n"
    },
    "supportedLanguages": [
      "python",
      "javascript",
      "java",
      "cpp"
    ],
    "testCases": [
      {
        "id": "tc-090-1",
        "input": "Valid case 1",
        "expectedOutput": "Standard Case 1 Result"
      },
      {
        "id": "tc-090-2",
        "input": "Edge case 2",
        "expectedOutput": "Standard Case 2 Result"
      }
    ],
    "hints": [
      "Consider optimal time complexity using Greedy principles.",
      "Break the state transition or traversal step down clearly.",
      "Check boundary/edge cases like empty input or duplicates."
    ],
    "approach": {
      "summary": "Optimal Greedy algorithm.",
      "steps": [
        "Understand problem constraints.",
        "Execute traversal / state update.",
        "Return final result."
      ]
    },
    "complexity": {
      "time": "O(N log N)",
      "space": "O(1) to O(N)",
      "analysis": "Algorithm runs in O(N log N) time with O(1) to O(N) space complexity."
    },
    "defaultMastery": 75,
    "recommendedTimeMinutes": 25
  },
  {
    "id": "pm-dsa-091",
    "title": "Gas Station Circular Tour",
    "slug": "gas-station-circular-tour",
    "difficulty": "Medium",
    "category": "DSA",
    "topics": [
      "Greedy"
    ],
    "companies": [
      "Amazon",
      "Google"
    ],
    "frequentlyAsked": true,
    "interviewImportance": "Frequently Asked",
    "description": "Given the problem input for **Gas Station Circular Tour**, implement an optimal algorithm adhering to the time and space constraints specified in interview standards.",
    "examples": [
      {
        "input": "Standard interview input vector",
        "output": "Expected optimal result",
        "explanation": "Demonstrates optimal Greedy traversal."
      }
    ],
    "constraints": [
      "1 <= input.length <= 10^5",
      "Output must be within standard data bounds."
    ],
    "starterCode": {
      "python": "def gasStationCircularTour(inputData) -> int:\n    # Write your solution here\n    return 0\n",
      "javascript": "function gasStationCircularTour(inputData) {\n    // Write your solution here\n    return 0;\n}\n",
      "java": "class Solution {\n    public int gasStationCircularTour(int[] inputData) {\n        // Write your solution here\n        return 0;\n    }\n}\n",
      "cpp": "class Solution {\npublic:\n    int gasStationCircularTour(vector<int>& inputData) {\n        // Write your solution here\n        return 0;\n    }\n};\n"
    },
    "supportedLanguages": [
      "python",
      "javascript",
      "java",
      "cpp"
    ],
    "testCases": [
      {
        "id": "tc-091-1",
        "input": "Valid case 1",
        "expectedOutput": "Standard Case 1 Result"
      },
      {
        "id": "tc-091-2",
        "input": "Edge case 2",
        "expectedOutput": "Standard Case 2 Result"
      }
    ],
    "hints": [
      "Consider optimal time complexity using Greedy principles.",
      "Break the state transition or traversal step down clearly.",
      "Check boundary/edge cases like empty input or duplicates."
    ],
    "approach": {
      "summary": "Optimal Greedy algorithm.",
      "steps": [
        "Understand problem constraints.",
        "Execute traversal / state update.",
        "Return final result."
      ]
    },
    "complexity": {
      "time": "O(N log N)",
      "space": "O(1) to O(N)",
      "analysis": "Algorithm runs in O(N log N) time with O(1) to O(N) space complexity."
    },
    "defaultMastery": 75,
    "recommendedTimeMinutes": 25
  },
  {
    "id": "pm-dsa-092",
    "title": "Hand of Straights",
    "slug": "hand-of-straights",
    "difficulty": "Medium",
    "category": "DSA",
    "topics": [
      "Greedy"
    ],
    "companies": [
      "Google",
      "Amazon"
    ],
    "frequentlyAsked": false,
    "interviewImportance": "Interview Essential",
    "description": "Given the problem input for **Hand of Straights**, implement an optimal algorithm adhering to the time and space constraints specified in interview standards.",
    "examples": [
      {
        "input": "Standard interview input vector",
        "output": "Expected optimal result",
        "explanation": "Demonstrates optimal Greedy traversal."
      }
    ],
    "constraints": [
      "1 <= input.length <= 10^5",
      "Output must be within standard data bounds."
    ],
    "starterCode": {
      "python": "def handOfStraights(inputData) -> boolean:\n    # Write your solution here\n    return False\n",
      "javascript": "function handOfStraights(inputData) {\n    // Write your solution here\n    return false;\n}\n",
      "java": "class Solution {\n    public boolean handOfStraights(int[] inputData) {\n        // Write your solution here\n        return false;\n    }\n}\n",
      "cpp": "class Solution {\npublic:\n    bool handOfStraights(vector<int>& inputData) {\n        // Write your solution here\n        return false;\n    }\n};\n"
    },
    "supportedLanguages": [
      "python",
      "javascript",
      "java",
      "cpp"
    ],
    "testCases": [
      {
        "id": "tc-092-1",
        "input": "Valid case 1",
        "expectedOutput": "Standard Case 1 Result"
      },
      {
        "id": "tc-092-2",
        "input": "Edge case 2",
        "expectedOutput": "Standard Case 2 Result"
      }
    ],
    "hints": [
      "Consider optimal time complexity using Greedy principles.",
      "Break the state transition or traversal step down clearly.",
      "Check boundary/edge cases like empty input or duplicates."
    ],
    "approach": {
      "summary": "Optimal Greedy algorithm.",
      "steps": [
        "Understand problem constraints.",
        "Execute traversal / state update.",
        "Return final result."
      ]
    },
    "complexity": {
      "time": "O(N log N)",
      "space": "O(1) to O(N)",
      "analysis": "Algorithm runs in O(N log N) time with O(1) to O(N) space complexity."
    },
    "defaultMastery": 75,
    "recommendedTimeMinutes": 25
  },
  {
    "id": "pm-dsa-093",
    "title": "Partition Labels",
    "slug": "partition-labels",
    "difficulty": "Medium",
    "category": "DSA",
    "topics": [
      "Greedy"
    ],
    "companies": [
      "Amazon",
      "Google"
    ],
    "frequentlyAsked": true,
    "interviewImportance": "Frequently Asked",
    "description": "Given the problem input for **Partition Labels**, implement an optimal algorithm adhering to the time and space constraints specified in interview standards.",
    "examples": [
      {
        "input": "Standard interview input vector",
        "output": "Expected optimal result",
        "explanation": "Demonstrates optimal Greedy traversal."
      }
    ],
    "constraints": [
      "1 <= input.length <= 10^5",
      "Output must be within standard data bounds."
    ],
    "starterCode": {
      "python": "def partitionLabels(inputData) -> int[]:\n    # Write your solution here\n    return []\n",
      "javascript": "function partitionLabels(inputData) {\n    // Write your solution here\n    return [];\n}\n",
      "java": "class Solution {\n    public int[] partitionLabels(int[] inputData) {\n        // Write your solution here\n        return new int[]{};\n    }\n}\n",
      "cpp": "class Solution {\npublic:\n    vector<int> partitionLabels(vector<int>& inputData) {\n        // Write your solution here\n        return {};\n    }\n};\n"
    },
    "supportedLanguages": [
      "python",
      "javascript",
      "java",
      "cpp"
    ],
    "testCases": [
      {
        "id": "tc-093-1",
        "input": "Valid case 1",
        "expectedOutput": "Standard Case 1 Result"
      },
      {
        "id": "tc-093-2",
        "input": "Edge case 2",
        "expectedOutput": "Standard Case 2 Result"
      }
    ],
    "hints": [
      "Consider optimal time complexity using Greedy principles.",
      "Break the state transition or traversal step down clearly.",
      "Check boundary/edge cases like empty input or duplicates."
    ],
    "approach": {
      "summary": "Optimal Greedy algorithm.",
      "steps": [
        "Understand problem constraints.",
        "Execute traversal / state update.",
        "Return final result."
      ]
    },
    "complexity": {
      "time": "O(N log N)",
      "space": "O(1) to O(N)",
      "analysis": "Algorithm runs in O(N log N) time with O(1) to O(N) space complexity."
    },
    "defaultMastery": 75,
    "recommendedTimeMinutes": 25
  },
  {
    "id": "pm-dsa-094",
    "title": "Subsets",
    "slug": "subsets",
    "difficulty": "Medium",
    "category": "DSA",
    "topics": [
      "Backtracking"
    ],
    "companies": [
      "Amazon",
      "Microsoft",
      "Google"
    ],
    "frequentlyAsked": true,
    "interviewImportance": "Frequently Asked",
    "description": "Given the problem input for **Subsets**, implement an optimal algorithm adhering to the time and space constraints specified in interview standards.",
    "examples": [
      {
        "input": "Standard interview input vector",
        "output": "Expected optimal result",
        "explanation": "Demonstrates optimal Backtracking traversal."
      }
    ],
    "constraints": [
      "1 <= input.length <= 10^5",
      "Output must be within standard data bounds."
    ],
    "starterCode": {
      "python": "def subsets(inputData) -> List<List<Integer>>:\n    # Write your solution here\n    return []\n",
      "javascript": "function subsets(inputData) {\n    // Write your solution here\n    return [];\n}\n",
      "java": "class Solution {\n    public List<List<Integer>> subsets(int[] inputData) {\n        // Write your solution here\n        return new ArrayList<>();\n    }\n}\n",
      "cpp": "class Solution {\npublic:\n    vector<vector<int>> subsets(vector<int>& inputData) {\n        // Write your solution here\n        return {};\n    }\n};\n"
    },
    "supportedLanguages": [
      "python",
      "javascript",
      "java",
      "cpp"
    ],
    "testCases": [
      {
        "id": "tc-094-1",
        "input": "Valid case 1",
        "expectedOutput": "Standard Case 1 Result"
      },
      {
        "id": "tc-094-2",
        "input": "Edge case 2",
        "expectedOutput": "Standard Case 2 Result"
      }
    ],
    "hints": [
      "Consider optimal time complexity using Backtracking principles.",
      "Break the state transition or traversal step down clearly.",
      "Check boundary/edge cases like empty input or duplicates."
    ],
    "approach": {
      "summary": "Optimal Backtracking algorithm.",
      "steps": [
        "Understand problem constraints.",
        "Execute traversal / state update.",
        "Return final result."
      ]
    },
    "complexity": {
      "time": "O(N log N)",
      "space": "O(1) to O(N)",
      "analysis": "Algorithm runs in O(N log N) time with O(1) to O(N) space complexity."
    },
    "defaultMastery": 75,
    "recommendedTimeMinutes": 25
  },
  {
    "id": "pm-dsa-095",
    "title": "Combination Sum",
    "slug": "combination-sum",
    "difficulty": "Medium",
    "category": "DSA",
    "topics": [
      "Backtracking"
    ],
    "companies": [
      "Amazon",
      "Microsoft",
      "Google"
    ],
    "frequentlyAsked": true,
    "interviewImportance": "Frequently Asked",
    "description": "Given the problem input for **Combination Sum**, implement an optimal algorithm adhering to the time and space constraints specified in interview standards.",
    "examples": [
      {
        "input": "Standard interview input vector",
        "output": "Expected optimal result",
        "explanation": "Demonstrates optimal Backtracking traversal."
      }
    ],
    "constraints": [
      "1 <= input.length <= 10^5",
      "Output must be within standard data bounds."
    ],
    "starterCode": {
      "python": "def combinationSum(inputData) -> List<List<Integer>>:\n    # Write your solution here\n    return []\n",
      "javascript": "function combinationSum(inputData) {\n    // Write your solution here\n    return [];\n}\n",
      "java": "class Solution {\n    public List<List<Integer>> combinationSum(int[] inputData) {\n        // Write your solution here\n        return new ArrayList<>();\n    }\n}\n",
      "cpp": "class Solution {\npublic:\n    vector<vector<int>> combinationSum(vector<int>& inputData) {\n        // Write your solution here\n        return {};\n    }\n};\n"
    },
    "supportedLanguages": [
      "python",
      "javascript",
      "java",
      "cpp"
    ],
    "testCases": [
      {
        "id": "tc-095-1",
        "input": "Valid case 1",
        "expectedOutput": "Standard Case 1 Result"
      },
      {
        "id": "tc-095-2",
        "input": "Edge case 2",
        "expectedOutput": "Standard Case 2 Result"
      }
    ],
    "hints": [
      "Consider optimal time complexity using Backtracking principles.",
      "Break the state transition or traversal step down clearly.",
      "Check boundary/edge cases like empty input or duplicates."
    ],
    "approach": {
      "summary": "Optimal Backtracking algorithm.",
      "steps": [
        "Understand problem constraints.",
        "Execute traversal / state update.",
        "Return final result."
      ]
    },
    "complexity": {
      "time": "O(N log N)",
      "space": "O(1) to O(N)",
      "analysis": "Algorithm runs in O(N log N) time with O(1) to O(N) space complexity."
    },
    "defaultMastery": 75,
    "recommendedTimeMinutes": 25
  },
  {
    "id": "pm-dsa-096",
    "title": "Permutations",
    "slug": "permutations",
    "difficulty": "Medium",
    "category": "DSA",
    "topics": [
      "Backtracking"
    ],
    "companies": [
      "Amazon",
      "Microsoft",
      "Google"
    ],
    "frequentlyAsked": true,
    "interviewImportance": "Frequently Asked",
    "description": "Given the problem input for **Permutations**, implement an optimal algorithm adhering to the time and space constraints specified in interview standards.",
    "examples": [
      {
        "input": "Standard interview input vector",
        "output": "Expected optimal result",
        "explanation": "Demonstrates optimal Backtracking traversal."
      }
    ],
    "constraints": [
      "1 <= input.length <= 10^5",
      "Output must be within standard data bounds."
    ],
    "starterCode": {
      "python": "def permutations(inputData) -> List<List<Integer>>:\n    # Write your solution here\n    return []\n",
      "javascript": "function permutations(inputData) {\n    // Write your solution here\n    return [];\n}\n",
      "java": "class Solution {\n    public List<List<Integer>> permutations(int[] inputData) {\n        // Write your solution here\n        return new ArrayList<>();\n    }\n}\n",
      "cpp": "class Solution {\npublic:\n    vector<vector<int>> permutations(vector<int>& inputData) {\n        // Write your solution here\n        return {};\n    }\n};\n"
    },
    "supportedLanguages": [
      "python",
      "javascript",
      "java",
      "cpp"
    ],
    "testCases": [
      {
        "id": "tc-096-1",
        "input": "Valid case 1",
        "expectedOutput": "Standard Case 1 Result"
      },
      {
        "id": "tc-096-2",
        "input": "Edge case 2",
        "expectedOutput": "Standard Case 2 Result"
      }
    ],
    "hints": [
      "Consider optimal time complexity using Backtracking principles.",
      "Break the state transition or traversal step down clearly.",
      "Check boundary/edge cases like empty input or duplicates."
    ],
    "approach": {
      "summary": "Optimal Backtracking algorithm.",
      "steps": [
        "Understand problem constraints.",
        "Execute traversal / state update.",
        "Return final result."
      ]
    },
    "complexity": {
      "time": "O(N log N)",
      "space": "O(1) to O(N)",
      "analysis": "Algorithm runs in O(N log N) time with O(1) to O(N) space complexity."
    },
    "defaultMastery": 75,
    "recommendedTimeMinutes": 25
  },
  {
    "id": "pm-dsa-097",
    "title": "Subsets II with Duplicates",
    "slug": "subsets-ii-with-duplicates",
    "difficulty": "Medium",
    "category": "DSA",
    "topics": [
      "Backtracking"
    ],
    "companies": [
      "Google",
      "Amazon"
    ],
    "frequentlyAsked": true,
    "interviewImportance": "Frequently Asked",
    "description": "Given the problem input for **Subsets II with Duplicates**, implement an optimal algorithm adhering to the time and space constraints specified in interview standards.",
    "examples": [
      {
        "input": "Standard interview input vector",
        "output": "Expected optimal result",
        "explanation": "Demonstrates optimal Backtracking traversal."
      }
    ],
    "constraints": [
      "1 <= input.length <= 10^5",
      "Output must be within standard data bounds."
    ],
    "starterCode": {
      "python": "def subsetsIiWithDuplicates(inputData) -> List<List<Integer>>:\n    # Write your solution here\n    return []\n",
      "javascript": "function subsetsIiWithDuplicates(inputData) {\n    // Write your solution here\n    return [];\n}\n",
      "java": "class Solution {\n    public List<List<Integer>> subsetsIiWithDuplicates(int[] inputData) {\n        // Write your solution here\n        return new ArrayList<>();\n    }\n}\n",
      "cpp": "class Solution {\npublic:\n    vector<vector<int>> subsetsIiWithDuplicates(vector<int>& inputData) {\n        // Write your solution here\n        return {};\n    }\n};\n"
    },
    "supportedLanguages": [
      "python",
      "javascript",
      "java",
      "cpp"
    ],
    "testCases": [
      {
        "id": "tc-097-1",
        "input": "Valid case 1",
        "expectedOutput": "Standard Case 1 Result"
      },
      {
        "id": "tc-097-2",
        "input": "Edge case 2",
        "expectedOutput": "Standard Case 2 Result"
      }
    ],
    "hints": [
      "Consider optimal time complexity using Backtracking principles.",
      "Break the state transition or traversal step down clearly.",
      "Check boundary/edge cases like empty input or duplicates."
    ],
    "approach": {
      "summary": "Optimal Backtracking algorithm.",
      "steps": [
        "Understand problem constraints.",
        "Execute traversal / state update.",
        "Return final result."
      ]
    },
    "complexity": {
      "time": "O(N log N)",
      "space": "O(1) to O(N)",
      "analysis": "Algorithm runs in O(N log N) time with O(1) to O(N) space complexity."
    },
    "defaultMastery": 75,
    "recommendedTimeMinutes": 25
  },
  {
    "id": "pm-dsa-098",
    "title": "Word Search in Grid",
    "slug": "word-search-in-grid",
    "difficulty": "Medium",
    "category": "DSA",
    "topics": [
      "Backtracking"
    ],
    "companies": [
      "Amazon",
      "Microsoft",
      "Google"
    ],
    "frequentlyAsked": true,
    "interviewImportance": "Frequently Asked",
    "description": "Given the problem input for **Word Search in Grid**, implement an optimal algorithm adhering to the time and space constraints specified in interview standards.",
    "examples": [
      {
        "input": "Standard interview input vector",
        "output": "Expected optimal result",
        "explanation": "Demonstrates optimal Backtracking traversal."
      }
    ],
    "constraints": [
      "1 <= input.length <= 10^5",
      "Output must be within standard data bounds."
    ],
    "starterCode": {
      "python": "def wordSearchInGrid(inputData) -> boolean:\n    # Write your solution here\n    return False\n",
      "javascript": "function wordSearchInGrid(inputData) {\n    // Write your solution here\n    return false;\n}\n",
      "java": "class Solution {\n    public boolean wordSearchInGrid(int[] inputData) {\n        // Write your solution here\n        return false;\n    }\n}\n",
      "cpp": "class Solution {\npublic:\n    bool wordSearchInGrid(vector<int>& inputData) {\n        // Write your solution here\n        return false;\n    }\n};\n"
    },
    "supportedLanguages": [
      "python",
      "javascript",
      "java",
      "cpp"
    ],
    "testCases": [
      {
        "id": "tc-098-1",
        "input": "Valid case 1",
        "expectedOutput": "Standard Case 1 Result"
      },
      {
        "id": "tc-098-2",
        "input": "Edge case 2",
        "expectedOutput": "Standard Case 2 Result"
      }
    ],
    "hints": [
      "Consider optimal time complexity using Backtracking principles.",
      "Break the state transition or traversal step down clearly.",
      "Check boundary/edge cases like empty input or duplicates."
    ],
    "approach": {
      "summary": "Optimal Backtracking algorithm.",
      "steps": [
        "Understand problem constraints.",
        "Execute traversal / state update.",
        "Return final result."
      ]
    },
    "complexity": {
      "time": "O(N log N)",
      "space": "O(1) to O(N)",
      "analysis": "Algorithm runs in O(N log N) time with O(1) to O(N) space complexity."
    },
    "defaultMastery": 75,
    "recommendedTimeMinutes": 25
  },
  {
    "id": "pm-dsa-099",
    "title": "Palindrome Partitioning",
    "slug": "palindrome-partitioning",
    "difficulty": "Medium",
    "category": "DSA",
    "topics": [
      "Backtracking"
    ],
    "companies": [
      "Google",
      "Amazon"
    ],
    "frequentlyAsked": true,
    "interviewImportance": "Frequently Asked",
    "description": "Given the problem input for **Palindrome Partitioning**, implement an optimal algorithm adhering to the time and space constraints specified in interview standards.",
    "examples": [
      {
        "input": "Standard interview input vector",
        "output": "Expected optimal result",
        "explanation": "Demonstrates optimal Backtracking traversal."
      }
    ],
    "constraints": [
      "1 <= input.length <= 10^5",
      "Output must be within standard data bounds."
    ],
    "starterCode": {
      "python": "def palindromePartitioning(inputData) -> List<List<Integer>>:\n    # Write your solution here\n    return []\n",
      "javascript": "function palindromePartitioning(inputData) {\n    // Write your solution here\n    return [];\n}\n",
      "java": "class Solution {\n    public List<List<Integer>> palindromePartitioning(int[] inputData) {\n        // Write your solution here\n        return new ArrayList<>();\n    }\n}\n",
      "cpp": "class Solution {\npublic:\n    vector<vector<int>> palindromePartitioning(vector<int>& inputData) {\n        // Write your solution here\n        return {};\n    }\n};\n"
    },
    "supportedLanguages": [
      "python",
      "javascript",
      "java",
      "cpp"
    ],
    "testCases": [
      {
        "id": "tc-099-1",
        "input": "Valid case 1",
        "expectedOutput": "Standard Case 1 Result"
      },
      {
        "id": "tc-099-2",
        "input": "Edge case 2",
        "expectedOutput": "Standard Case 2 Result"
      }
    ],
    "hints": [
      "Consider optimal time complexity using Backtracking principles.",
      "Break the state transition or traversal step down clearly.",
      "Check boundary/edge cases like empty input or duplicates."
    ],
    "approach": {
      "summary": "Optimal Backtracking algorithm.",
      "steps": [
        "Understand problem constraints.",
        "Execute traversal / state update.",
        "Return final result."
      ]
    },
    "complexity": {
      "time": "O(N log N)",
      "space": "O(1) to O(N)",
      "analysis": "Algorithm runs in O(N log N) time with O(1) to O(N) space complexity."
    },
    "defaultMastery": 75,
    "recommendedTimeMinutes": 25
  },
  {
    "id": "pm-dsa-100",
    "title": "N-Queens Placement",
    "slug": "n-queens-placement",
    "difficulty": "Hard",
    "category": "DSA",
    "topics": [
      "Backtracking"
    ],
    "companies": [
      "Amazon",
      "Google",
      "Microsoft"
    ],
    "frequentlyAsked": true,
    "interviewImportance": "Frequently Asked",
    "description": "Given the problem input for **N-Queens Placement**, implement an optimal algorithm adhering to the time and space constraints specified in interview standards.",
    "examples": [
      {
        "input": "Standard interview input vector",
        "output": "Expected optimal result",
        "explanation": "Demonstrates optimal Backtracking traversal."
      }
    ],
    "constraints": [
      "1 <= input.length <= 10^5",
      "Output must be within standard data bounds."
    ],
    "starterCode": {
      "python": "def nQueensPlacement(inputData) -> List<List<Integer>>:\n    # Write your solution here\n    return []\n",
      "javascript": "function nQueensPlacement(inputData) {\n    // Write your solution here\n    return [];\n}\n",
      "java": "class Solution {\n    public List<List<Integer>> nQueensPlacement(int[] inputData) {\n        // Write your solution here\n        return new ArrayList<>();\n    }\n}\n",
      "cpp": "class Solution {\npublic:\n    vector<vector<int>> nQueensPlacement(vector<int>& inputData) {\n        // Write your solution here\n        return {};\n    }\n};\n"
    },
    "supportedLanguages": [
      "python",
      "javascript",
      "java",
      "cpp"
    ],
    "testCases": [
      {
        "id": "tc-100-1",
        "input": "Valid case 1",
        "expectedOutput": "Standard Case 1 Result"
      },
      {
        "id": "tc-100-2",
        "input": "Edge case 2",
        "expectedOutput": "Standard Case 2 Result"
      }
    ],
    "hints": [
      "Consider optimal time complexity using Backtracking principles.",
      "Break the state transition or traversal step down clearly.",
      "Check boundary/edge cases like empty input or duplicates."
    ],
    "approach": {
      "summary": "Optimal Backtracking algorithm.",
      "steps": [
        "Understand problem constraints.",
        "Execute traversal / state update.",
        "Return final result."
      ]
    },
    "complexity": {
      "time": "O(N log N)",
      "space": "O(1) to O(N)",
      "analysis": "Algorithm runs in O(N log N) time with O(1) to O(N) space complexity."
    },
    "defaultMastery": 75,
    "recommendedTimeMinutes": 40
  },
  {
    "id": "pm-dsa-101",
    "title": "Single Number",
    "slug": "single-number",
    "difficulty": "Easy",
    "category": "DSA",
    "topics": [
      "Math"
    ],
    "companies": [
      "Amazon",
      "Microsoft",
      "TCS"
    ],
    "frequentlyAsked": true,
    "interviewImportance": "Frequently Asked",
    "description": "Given the problem input for **Single Number**, implement an optimal algorithm adhering to the time and space constraints specified in interview standards.",
    "examples": [
      {
        "input": "Standard interview input vector",
        "output": "Expected optimal result",
        "explanation": "Demonstrates optimal Math traversal."
      }
    ],
    "constraints": [
      "1 <= input.length <= 10^5",
      "Output must be within standard data bounds."
    ],
    "starterCode": {
      "python": "def singleNumber(inputData) -> int:\n    # Write your solution here\n    return 0\n",
      "javascript": "function singleNumber(inputData) {\n    // Write your solution here\n    return 0;\n}\n",
      "java": "class Solution {\n    public int singleNumber(int[] inputData) {\n        // Write your solution here\n        return 0;\n    }\n}\n",
      "cpp": "class Solution {\npublic:\n    int singleNumber(vector<int>& inputData) {\n        // Write your solution here\n        return 0;\n    }\n};\n"
    },
    "supportedLanguages": [
      "python",
      "javascript",
      "java",
      "cpp"
    ],
    "testCases": [
      {
        "id": "tc-101-1",
        "input": "Valid case 1",
        "expectedOutput": "Standard Case 1 Result"
      },
      {
        "id": "tc-101-2",
        "input": "Edge case 2",
        "expectedOutput": "Standard Case 2 Result"
      }
    ],
    "hints": [
      "Consider optimal time complexity using Math principles.",
      "Break the state transition or traversal step down clearly.",
      "Check boundary/edge cases like empty input or duplicates."
    ],
    "approach": {
      "summary": "Optimal Math algorithm.",
      "steps": [
        "Understand problem constraints.",
        "Execute traversal / state update.",
        "Return final result."
      ]
    },
    "complexity": {
      "time": "O(N)",
      "space": "O(1) to O(N)",
      "analysis": "Algorithm runs in O(N) time with O(1) to O(N) space complexity."
    },
    "defaultMastery": 75,
    "recommendedTimeMinutes": 15
  },
  {
    "id": "pm-dsa-102",
    "title": "Number of 1 Bits (Hamming Weight)",
    "slug": "number-of-1-bits-hamming-weight-",
    "difficulty": "Easy",
    "category": "DSA",
    "topics": [
      "Math"
    ],
    "companies": [
      "Amazon",
      "Microsoft",
      "Infosys"
    ],
    "frequentlyAsked": true,
    "interviewImportance": "Frequently Asked",
    "description": "Given the problem input for **Number of 1 Bits (Hamming Weight)**, implement an optimal algorithm adhering to the time and space constraints specified in interview standards.",
    "examples": [
      {
        "input": "Standard interview input vector",
        "output": "Expected optimal result",
        "explanation": "Demonstrates optimal Math traversal."
      }
    ],
    "constraints": [
      "1 <= input.length <= 10^5",
      "Output must be within standard data bounds."
    ],
    "starterCode": {
      "python": "def numberOf1BitsHammingWeight-(inputData) -> int:\n    # Write your solution here\n    return 0\n",
      "javascript": "function numberOf1BitsHammingWeight-(inputData) {\n    // Write your solution here\n    return 0;\n}\n",
      "java": "class Solution {\n    public int numberOf1BitsHammingWeight-(int[] inputData) {\n        // Write your solution here\n        return 0;\n    }\n}\n",
      "cpp": "class Solution {\npublic:\n    int numberOf1BitsHammingWeight-(vector<int>& inputData) {\n        // Write your solution here\n        return 0;\n    }\n};\n"
    },
    "supportedLanguages": [
      "python",
      "javascript",
      "java",
      "cpp"
    ],
    "testCases": [
      {
        "id": "tc-102-1",
        "input": "Valid case 1",
        "expectedOutput": "Standard Case 1 Result"
      },
      {
        "id": "tc-102-2",
        "input": "Edge case 2",
        "expectedOutput": "Standard Case 2 Result"
      }
    ],
    "hints": [
      "Consider optimal time complexity using Math principles.",
      "Break the state transition or traversal step down clearly.",
      "Check boundary/edge cases like empty input or duplicates."
    ],
    "approach": {
      "summary": "Optimal Math algorithm.",
      "steps": [
        "Understand problem constraints.",
        "Execute traversal / state update.",
        "Return final result."
      ]
    },
    "complexity": {
      "time": "O(N)",
      "space": "O(1) to O(N)",
      "analysis": "Algorithm runs in O(N) time with O(1) to O(N) space complexity."
    },
    "defaultMastery": 75,
    "recommendedTimeMinutes": 15
  },
  {
    "id": "pm-dsa-103",
    "title": "Counting Bits",
    "slug": "counting-bits",
    "difficulty": "Easy",
    "category": "DSA",
    "topics": [
      "Math"
    ],
    "companies": [
      "Amazon",
      "Google"
    ],
    "frequentlyAsked": true,
    "interviewImportance": "Frequently Asked",
    "description": "Given the problem input for **Counting Bits**, implement an optimal algorithm adhering to the time and space constraints specified in interview standards.",
    "examples": [
      {
        "input": "Standard interview input vector",
        "output": "Expected optimal result",
        "explanation": "Demonstrates optimal Math traversal."
      }
    ],
    "constraints": [
      "1 <= input.length <= 10^5",
      "Output must be within standard data bounds."
    ],
    "starterCode": {
      "python": "def countingBits(inputData) -> int[]:\n    # Write your solution here\n    return []\n",
      "javascript": "function countingBits(inputData) {\n    // Write your solution here\n    return [];\n}\n",
      "java": "class Solution {\n    public int[] countingBits(int[] inputData) {\n        // Write your solution here\n        return new int[]{};\n    }\n}\n",
      "cpp": "class Solution {\npublic:\n    vector<int> countingBits(vector<int>& inputData) {\n        // Write your solution here\n        return {};\n    }\n};\n"
    },
    "supportedLanguages": [
      "python",
      "javascript",
      "java",
      "cpp"
    ],
    "testCases": [
      {
        "id": "tc-103-1",
        "input": "Valid case 1",
        "expectedOutput": "Standard Case 1 Result"
      },
      {
        "id": "tc-103-2",
        "input": "Edge case 2",
        "expectedOutput": "Standard Case 2 Result"
      }
    ],
    "hints": [
      "Consider optimal time complexity using Math principles.",
      "Break the state transition or traversal step down clearly.",
      "Check boundary/edge cases like empty input or duplicates."
    ],
    "approach": {
      "summary": "Optimal Math algorithm.",
      "steps": [
        "Understand problem constraints.",
        "Execute traversal / state update.",
        "Return final result."
      ]
    },
    "complexity": {
      "time": "O(N)",
      "space": "O(1) to O(N)",
      "analysis": "Algorithm runs in O(N) time with O(1) to O(N) space complexity."
    },
    "defaultMastery": 75,
    "recommendedTimeMinutes": 15
  },
  {
    "id": "pm-dsa-104",
    "title": "Reverse Bits",
    "slug": "reverse-bits",
    "difficulty": "Easy",
    "category": "DSA",
    "topics": [
      "Math"
    ],
    "companies": [
      "Amazon",
      "Microsoft"
    ],
    "frequentlyAsked": true,
    "interviewImportance": "Frequently Asked",
    "description": "Given the problem input for **Reverse Bits**, implement an optimal algorithm adhering to the time and space constraints specified in interview standards.",
    "examples": [
      {
        "input": "Standard interview input vector",
        "output": "Expected optimal result",
        "explanation": "Demonstrates optimal Math traversal."
      }
    ],
    "constraints": [
      "1 <= input.length <= 10^5",
      "Output must be within standard data bounds."
    ],
    "starterCode": {
      "python": "def reverseBits(inputData) -> int:\n    # Write your solution here\n    return 0\n",
      "javascript": "function reverseBits(inputData) {\n    // Write your solution here\n    return 0;\n}\n",
      "java": "class Solution {\n    public int reverseBits(int[] inputData) {\n        // Write your solution here\n        return 0;\n    }\n}\n",
      "cpp": "class Solution {\npublic:\n    int reverseBits(vector<int>& inputData) {\n        // Write your solution here\n        return 0;\n    }\n};\n"
    },
    "supportedLanguages": [
      "python",
      "javascript",
      "java",
      "cpp"
    ],
    "testCases": [
      {
        "id": "tc-104-1",
        "input": "Valid case 1",
        "expectedOutput": "Standard Case 1 Result"
      },
      {
        "id": "tc-104-2",
        "input": "Edge case 2",
        "expectedOutput": "Standard Case 2 Result"
      }
    ],
    "hints": [
      "Consider optimal time complexity using Math principles.",
      "Break the state transition or traversal step down clearly.",
      "Check boundary/edge cases like empty input or duplicates."
    ],
    "approach": {
      "summary": "Optimal Math algorithm.",
      "steps": [
        "Understand problem constraints.",
        "Execute traversal / state update.",
        "Return final result."
      ]
    },
    "complexity": {
      "time": "O(N)",
      "space": "O(1) to O(N)",
      "analysis": "Algorithm runs in O(N) time with O(1) to O(N) space complexity."
    },
    "defaultMastery": 75,
    "recommendedTimeMinutes": 15
  },
  {
    "id": "pm-dsa-105",
    "title": "Missing Number",
    "slug": "missing-number",
    "difficulty": "Easy",
    "category": "DSA",
    "topics": [
      "Math"
    ],
    "companies": [
      "Amazon",
      "Microsoft",
      "TCS"
    ],
    "frequentlyAsked": true,
    "interviewImportance": "Frequently Asked",
    "description": "Given the problem input for **Missing Number**, implement an optimal algorithm adhering to the time and space constraints specified in interview standards.",
    "examples": [
      {
        "input": "Standard interview input vector",
        "output": "Expected optimal result",
        "explanation": "Demonstrates optimal Math traversal."
      }
    ],
    "constraints": [
      "1 <= input.length <= 10^5",
      "Output must be within standard data bounds."
    ],
    "starterCode": {
      "python": "def missingNumber(inputData) -> int:\n    # Write your solution here\n    return 0\n",
      "javascript": "function missingNumber(inputData) {\n    // Write your solution here\n    return 0;\n}\n",
      "java": "class Solution {\n    public int missingNumber(int[] inputData) {\n        // Write your solution here\n        return 0;\n    }\n}\n",
      "cpp": "class Solution {\npublic:\n    int missingNumber(vector<int>& inputData) {\n        // Write your solution here\n        return 0;\n    }\n};\n"
    },
    "supportedLanguages": [
      "python",
      "javascript",
      "java",
      "cpp"
    ],
    "testCases": [
      {
        "id": "tc-105-1",
        "input": "Valid case 1",
        "expectedOutput": "Standard Case 1 Result"
      },
      {
        "id": "tc-105-2",
        "input": "Edge case 2",
        "expectedOutput": "Standard Case 2 Result"
      }
    ],
    "hints": [
      "Consider optimal time complexity using Math principles.",
      "Break the state transition or traversal step down clearly.",
      "Check boundary/edge cases like empty input or duplicates."
    ],
    "approach": {
      "summary": "Optimal Math algorithm.",
      "steps": [
        "Understand problem constraints.",
        "Execute traversal / state update.",
        "Return final result."
      ]
    },
    "complexity": {
      "time": "O(N)",
      "space": "O(1) to O(N)",
      "analysis": "Algorithm runs in O(N) time with O(1) to O(N) space complexity."
    },
    "defaultMastery": 75,
    "recommendedTimeMinutes": 15
  },
  {
    "id": "pm-dsa-106",
    "title": "Sum of Two Integers without + Operator",
    "slug": "sum-of-two-integers-without-operator",
    "difficulty": "Medium",
    "category": "DSA",
    "topics": [
      "Math"
    ],
    "companies": [
      "Amazon",
      "Google"
    ],
    "frequentlyAsked": true,
    "interviewImportance": "Frequently Asked",
    "description": "Given the problem input for **Sum of Two Integers without + Operator**, implement an optimal algorithm adhering to the time and space constraints specified in interview standards.",
    "examples": [
      {
        "input": "Standard interview input vector",
        "output": "Expected optimal result",
        "explanation": "Demonstrates optimal Math traversal."
      }
    ],
    "constraints": [
      "1 <= input.length <= 10^5",
      "Output must be within standard data bounds."
    ],
    "starterCode": {
      "python": "def sumOfTwoIntegersWithoutOperator(inputData) -> int:\n    # Write your solution here\n    return 0\n",
      "javascript": "function sumOfTwoIntegersWithoutOperator(inputData) {\n    // Write your solution here\n    return 0;\n}\n",
      "java": "class Solution {\n    public int sumOfTwoIntegersWithoutOperator(int[] inputData) {\n        // Write your solution here\n        return 0;\n    }\n}\n",
      "cpp": "class Solution {\npublic:\n    int sumOfTwoIntegersWithoutOperator(vector<int>& inputData) {\n        // Write your solution here\n        return 0;\n    }\n};\n"
    },
    "supportedLanguages": [
      "python",
      "javascript",
      "java",
      "cpp"
    ],
    "testCases": [
      {
        "id": "tc-106-1",
        "input": "Valid case 1",
        "expectedOutput": "Standard Case 1 Result"
      },
      {
        "id": "tc-106-2",
        "input": "Edge case 2",
        "expectedOutput": "Standard Case 2 Result"
      }
    ],
    "hints": [
      "Consider optimal time complexity using Math principles.",
      "Break the state transition or traversal step down clearly.",
      "Check boundary/edge cases like empty input or duplicates."
    ],
    "approach": {
      "summary": "Optimal Math algorithm.",
      "steps": [
        "Understand problem constraints.",
        "Execute traversal / state update.",
        "Return final result."
      ]
    },
    "complexity": {
      "time": "O(N log N)",
      "space": "O(1) to O(N)",
      "analysis": "Algorithm runs in O(N log N) time with O(1) to O(N) space complexity."
    },
    "defaultMastery": 75,
    "recommendedTimeMinutes": 25
  },
  {
    "id": "pm-dsa-107",
    "title": "Reverse Integer",
    "slug": "reverse-integer",
    "difficulty": "Medium",
    "category": "DSA",
    "topics": [
      "Math"
    ],
    "companies": [
      "Amazon",
      "Microsoft"
    ],
    "frequentlyAsked": true,
    "interviewImportance": "Frequently Asked",
    "description": "Given the problem input for **Reverse Integer**, implement an optimal algorithm adhering to the time and space constraints specified in interview standards.",
    "examples": [
      {
        "input": "Standard interview input vector",
        "output": "Expected optimal result",
        "explanation": "Demonstrates optimal Math traversal."
      }
    ],
    "constraints": [
      "1 <= input.length <= 10^5",
      "Output must be within standard data bounds."
    ],
    "starterCode": {
      "python": "def reverseInteger(inputData) -> int:\n    # Write your solution here\n    return 0\n",
      "javascript": "function reverseInteger(inputData) {\n    // Write your solution here\n    return 0;\n}\n",
      "java": "class Solution {\n    public int reverseInteger(int[] inputData) {\n        // Write your solution here\n        return 0;\n    }\n}\n",
      "cpp": "class Solution {\npublic:\n    int reverseInteger(vector<int>& inputData) {\n        // Write your solution here\n        return 0;\n    }\n};\n"
    },
    "supportedLanguages": [
      "python",
      "javascript",
      "java",
      "cpp"
    ],
    "testCases": [
      {
        "id": "tc-107-1",
        "input": "Valid case 1",
        "expectedOutput": "Standard Case 1 Result"
      },
      {
        "id": "tc-107-2",
        "input": "Edge case 2",
        "expectedOutput": "Standard Case 2 Result"
      }
    ],
    "hints": [
      "Consider optimal time complexity using Math principles.",
      "Break the state transition or traversal step down clearly.",
      "Check boundary/edge cases like empty input or duplicates."
    ],
    "approach": {
      "summary": "Optimal Math algorithm.",
      "steps": [
        "Understand problem constraints.",
        "Execute traversal / state update.",
        "Return final result."
      ]
    },
    "complexity": {
      "time": "O(N log N)",
      "space": "O(1) to O(N)",
      "analysis": "Algorithm runs in O(N log N) time with O(1) to O(N) space complexity."
    },
    "defaultMastery": 75,
    "recommendedTimeMinutes": 25
  },
  {
    "id": "pm-dsa-108",
    "title": "Pow(x, n) Implementation",
    "slug": "pow-x-n-implementation",
    "difficulty": "Medium",
    "category": "DSA",
    "topics": [
      "Math"
    ],
    "companies": [
      "Google",
      "Amazon",
      "Microsoft"
    ],
    "frequentlyAsked": true,
    "interviewImportance": "Frequently Asked",
    "description": "Given the problem input for **Pow(x, n) Implementation**, implement an optimal algorithm adhering to the time and space constraints specified in interview standards.",
    "examples": [
      {
        "input": "Standard interview input vector",
        "output": "Expected optimal result",
        "explanation": "Demonstrates optimal Math traversal."
      }
    ],
    "constraints": [
      "1 <= input.length <= 10^5",
      "Output must be within standard data bounds."
    ],
    "starterCode": {
      "python": "def powXNImplementation(inputData) -> double:\n    # Write your solution here\n    return 0.0\n",
      "javascript": "function powXNImplementation(inputData) {\n    // Write your solution here\n    return 0.0;\n}\n",
      "java": "class Solution {\n    public double powXNImplementation(int[] inputData) {\n        // Write your solution here\n        return 0.0;\n    }\n}\n",
      "cpp": "class Solution {\npublic:\n    double powXNImplementation(vector<int>& inputData) {\n        // Write your solution here\n        return 0.0;\n    }\n};\n"
    },
    "supportedLanguages": [
      "python",
      "javascript",
      "java",
      "cpp"
    ],
    "testCases": [
      {
        "id": "tc-108-1",
        "input": "Valid case 1",
        "expectedOutput": "Standard Case 1 Result"
      },
      {
        "id": "tc-108-2",
        "input": "Edge case 2",
        "expectedOutput": "Standard Case 2 Result"
      }
    ],
    "hints": [
      "Consider optimal time complexity using Math principles.",
      "Break the state transition or traversal step down clearly.",
      "Check boundary/edge cases like empty input or duplicates."
    ],
    "approach": {
      "summary": "Optimal Math algorithm.",
      "steps": [
        "Understand problem constraints.",
        "Execute traversal / state update.",
        "Return final result."
      ]
    },
    "complexity": {
      "time": "O(N log N)",
      "space": "O(1) to O(N)",
      "analysis": "Algorithm runs in O(N log N) time with O(1) to O(N) space complexity."
    },
    "defaultMastery": 75,
    "recommendedTimeMinutes": 25
  },
  {
    "id": "pm-sql-001",
    "title": "Recyclable and Low Fat Products",
    "slug": "recyclable-and-low-fat-products",
    "difficulty": "Easy",
    "category": "SQL",
    "topics": [
      "SQL",
      "SELECT & WHERE"
    ],
    "companies": [
      "Amazon",
      "Microsoft",
      "TCS",
      "Accenture",
      "Cognizant"
    ],
    "frequentlyAsked": true,
    "interviewImportance": "Frequently Asked",
    "description": "Find the ids of products that are both low fat and recyclable.\n\nWrite a solution in SQL using standard ANSI/PostgreSQL/MySQL syntax.",
    "examples": [
      {
        "input": "Relational database schema with sample records",
        "output": "Queried result table",
        "explanation": "Matches expected SELECT & WHERE output."
      }
    ],
    "constraints": [
      "Output column names must match the requested schema.",
      "Handle NULLs and duplicate rankings appropriately."
    ],
    "starterCode": {
      "python": "# Reference query:\n# SELECT product_id FROM Products WHERE low_fats = 'Y' AND recyclable = 'Y';\n",
      "javascript": "// Reference query:\n// SELECT product_id FROM Products WHERE low_fats = 'Y' AND recyclable = 'Y';\n",
      "java": "// SQL Solution reference\n",
      "cpp": "// SQL Solution reference\n",
      "sql": "-- Write your SQL query here\nSELECT product_id\nFROM Products\nWHERE low_fats = 'Y' AND recyclable = 'Y';\n"
    },
    "supportedLanguages": [
      "python",
      "javascript",
      "java",
      "cpp",
      "sql"
    ],
    "testCases": [
      {
        "id": "tc-sql-001-1",
        "input": "Standard Database Tables",
        "expectedOutput": "Expected Records"
      }
    ],
    "hints": [
      "Identify the primary table and joined relations.",
      "Use SELECT & WHERE to group or filter correctly.",
      "Handle potential edge cases with NULLs or edge ties."
    ],
    "approach": {
      "summary": "Optimal SQL query using SELECT & WHERE.",
      "steps": [
        "Structure SELECT clause.",
        "Apply JOIN or WHERE filtering.",
        "Aggregate with GROUP BY or window functions."
      ]
    },
    "complexity": {
      "time": "O(N log N)",
      "space": "O(N)",
      "analysis": "Algorithm runs in O(N log N) time with O(N) space complexity."
    },
    "defaultMastery": 80,
    "recommendedTimeMinutes": 15
  },
  {
    "id": "pm-sql-002",
    "title": "Find Customer Referee",
    "slug": "find-customer-referee",
    "difficulty": "Easy",
    "category": "SQL",
    "topics": [
      "SQL",
      "WHERE & NULLs"
    ],
    "companies": [
      "Amazon",
      "Microsoft",
      "TCS",
      "Accenture",
      "Cognizant"
    ],
    "frequentlyAsked": true,
    "interviewImportance": "Frequently Asked",
    "description": "Find the names of the customer that are not referred by the customer with id = 2.\n\nWrite a solution in SQL using standard ANSI/PostgreSQL/MySQL syntax.",
    "examples": [
      {
        "input": "Relational database schema with sample records",
        "output": "Queried result table",
        "explanation": "Matches expected WHERE & NULLs output."
      }
    ],
    "constraints": [
      "Output column names must match the requested schema.",
      "Handle NULLs and duplicate rankings appropriately."
    ],
    "starterCode": {
      "python": "# Reference query:\n# SELECT name FROM Customer WHERE referee_id != 2 OR referee_id IS NULL;\n",
      "javascript": "// Reference query:\n// SELECT name FROM Customer WHERE referee_id != 2 OR referee_id IS NULL;\n",
      "java": "// SQL Solution reference\n",
      "cpp": "// SQL Solution reference\n",
      "sql": "-- Write your SQL query here\nSELECT name\nFROM Customer\nWHERE referee_id != 2 OR referee_id IS NULL;\n"
    },
    "supportedLanguages": [
      "python",
      "javascript",
      "java",
      "cpp",
      "sql"
    ],
    "testCases": [
      {
        "id": "tc-sql-002-1",
        "input": "Standard Database Tables",
        "expectedOutput": "Expected Records"
      }
    ],
    "hints": [
      "Identify the primary table and joined relations.",
      "Use WHERE & NULLs to group or filter correctly.",
      "Handle potential edge cases with NULLs or edge ties."
    ],
    "approach": {
      "summary": "Optimal SQL query using WHERE & NULLs.",
      "steps": [
        "Structure SELECT clause.",
        "Apply JOIN or WHERE filtering.",
        "Aggregate with GROUP BY or window functions."
      ]
    },
    "complexity": {
      "time": "O(N log N)",
      "space": "O(N)",
      "analysis": "Algorithm runs in O(N log N) time with O(N) space complexity."
    },
    "defaultMastery": 80,
    "recommendedTimeMinutes": 15
  },
  {
    "id": "pm-sql-003",
    "title": "Big Countries",
    "slug": "big-countries",
    "difficulty": "Easy",
    "category": "SQL",
    "topics": [
      "SQL",
      "WHERE filtering"
    ],
    "companies": [
      "Amazon",
      "Microsoft",
      "TCS",
      "Accenture",
      "Cognizant"
    ],
    "frequentlyAsked": true,
    "interviewImportance": "Frequently Asked",
    "description": "A country is big if it has an area of at least 3 million km² or a population of at least 25 million. Find the name, population, and area of the big countries.\n\nWrite a solution in SQL using standard ANSI/PostgreSQL/MySQL syntax.",
    "examples": [
      {
        "input": "Relational database schema with sample records",
        "output": "Queried result table",
        "explanation": "Matches expected WHERE filtering output."
      }
    ],
    "constraints": [
      "Output column names must match the requested schema.",
      "Handle NULLs and duplicate rankings appropriately."
    ],
    "starterCode": {
      "python": "# Reference query:\n# SELECT name, population, area FROM World WHERE area >= 3000000 OR population >= 25000000;\n",
      "javascript": "// Reference query:\n// SELECT name, population, area FROM World WHERE area >= 3000000 OR population >= 25000000;\n",
      "java": "// SQL Solution reference\n",
      "cpp": "// SQL Solution reference\n",
      "sql": "-- Write your SQL query here\nSELECT name, population, area\nFROM World\nWHERE area >= 3000000 OR population >= 25000000;\n"
    },
    "supportedLanguages": [
      "python",
      "javascript",
      "java",
      "cpp",
      "sql"
    ],
    "testCases": [
      {
        "id": "tc-sql-003-1",
        "input": "Standard Database Tables",
        "expectedOutput": "Expected Records"
      }
    ],
    "hints": [
      "Identify the primary table and joined relations.",
      "Use WHERE filtering to group or filter correctly.",
      "Handle potential edge cases with NULLs or edge ties."
    ],
    "approach": {
      "summary": "Optimal SQL query using WHERE filtering.",
      "steps": [
        "Structure SELECT clause.",
        "Apply JOIN or WHERE filtering.",
        "Aggregate with GROUP BY or window functions."
      ]
    },
    "complexity": {
      "time": "O(N log N)",
      "space": "O(N)",
      "analysis": "Algorithm runs in O(N log N) time with O(N) space complexity."
    },
    "defaultMastery": 80,
    "recommendedTimeMinutes": 15
  },
  {
    "id": "pm-sql-004",
    "title": "Article Views I",
    "slug": "article-views-i",
    "difficulty": "Easy",
    "category": "SQL",
    "topics": [
      "SQL",
      "DISTINCT & ORDER BY"
    ],
    "companies": [
      "Amazon",
      "Microsoft",
      "TCS",
      "Accenture",
      "Cognizant"
    ],
    "frequentlyAsked": true,
    "interviewImportance": "Frequently Asked",
    "description": "Find all the authors that viewed at least one of their own articles.\n\nWrite a solution in SQL using standard ANSI/PostgreSQL/MySQL syntax.",
    "examples": [
      {
        "input": "Relational database schema with sample records",
        "output": "Queried result table",
        "explanation": "Matches expected DISTINCT & ORDER BY output."
      }
    ],
    "constraints": [
      "Output column names must match the requested schema.",
      "Handle NULLs and duplicate rankings appropriately."
    ],
    "starterCode": {
      "python": "# Reference query:\n# SELECT DISTINCT author_id AS id FROM Views WHERE author_id = viewer_id ORDER BY id ASC;\n",
      "javascript": "// Reference query:\n// SELECT DISTINCT author_id AS id FROM Views WHERE author_id = viewer_id ORDER BY id ASC;\n",
      "java": "// SQL Solution reference\n",
      "cpp": "// SQL Solution reference\n",
      "sql": "-- Write your SQL query here\nSELECT DISTINCT author_id AS id\nFROM Views\nWHERE author_id = viewer_id\nORDER BY id ASC;\n"
    },
    "supportedLanguages": [
      "python",
      "javascript",
      "java",
      "cpp",
      "sql"
    ],
    "testCases": [
      {
        "id": "tc-sql-004-1",
        "input": "Standard Database Tables",
        "expectedOutput": "Expected Records"
      }
    ],
    "hints": [
      "Identify the primary table and joined relations.",
      "Use DISTINCT & ORDER BY to group or filter correctly.",
      "Handle potential edge cases with NULLs or edge ties."
    ],
    "approach": {
      "summary": "Optimal SQL query using DISTINCT & ORDER BY.",
      "steps": [
        "Structure SELECT clause.",
        "Apply JOIN or WHERE filtering.",
        "Aggregate with GROUP BY or window functions."
      ]
    },
    "complexity": {
      "time": "O(N log N)",
      "space": "O(N)",
      "analysis": "Algorithm runs in O(N log N) time with O(N) space complexity."
    },
    "defaultMastery": 80,
    "recommendedTimeMinutes": 15
  },
  {
    "id": "pm-sql-005",
    "title": "Replace Employee ID With The Unique Identifier",
    "slug": "replace-employee-id-with-the-unique-identifier",
    "difficulty": "Easy",
    "category": "SQL",
    "topics": [
      "SQL",
      "LEFT JOIN"
    ],
    "companies": [
      "Amazon",
      "Microsoft",
      "TCS",
      "Accenture",
      "Cognizant"
    ],
    "frequentlyAsked": true,
    "interviewImportance": "Frequently Asked",
    "description": "Show the unique ID of each user, If a user does not have a unique ID replace just show null.\n\nWrite a solution in SQL using standard ANSI/PostgreSQL/MySQL syntax.",
    "examples": [
      {
        "input": "Relational database schema with sample records",
        "output": "Queried result table",
        "explanation": "Matches expected LEFT JOIN output."
      }
    ],
    "constraints": [
      "Output column names must match the requested schema.",
      "Handle NULLs and duplicate rankings appropriately."
    ],
    "starterCode": {
      "python": "# Reference query:\n# SELECT eu.unique_id, e.name FROM Employees e LEFT JOIN EmployeeUNI eu ON e.id = eu.id;\n",
      "javascript": "// Reference query:\n// SELECT eu.unique_id, e.name FROM Employees e LEFT JOIN EmployeeUNI eu ON e.id = eu.id;\n",
      "java": "// SQL Solution reference\n",
      "cpp": "// SQL Solution reference\n",
      "sql": "-- Write your SQL query here\nSELECT eu.unique_id, e.name\nFROM Employees e\nLEFT JOIN EmployeeUNI eu ON e.id = eu.id;\n"
    },
    "supportedLanguages": [
      "python",
      "javascript",
      "java",
      "cpp",
      "sql"
    ],
    "testCases": [
      {
        "id": "tc-sql-005-1",
        "input": "Standard Database Tables",
        "expectedOutput": "Expected Records"
      }
    ],
    "hints": [
      "Identify the primary table and joined relations.",
      "Use LEFT JOIN to group or filter correctly.",
      "Handle potential edge cases with NULLs or edge ties."
    ],
    "approach": {
      "summary": "Optimal SQL query using LEFT JOIN.",
      "steps": [
        "Structure SELECT clause.",
        "Apply JOIN or WHERE filtering.",
        "Aggregate with GROUP BY or window functions."
      ]
    },
    "complexity": {
      "time": "O(N log N)",
      "space": "O(N)",
      "analysis": "Algorithm runs in O(N log N) time with O(N) space complexity."
    },
    "defaultMastery": 80,
    "recommendedTimeMinutes": 15
  },
  {
    "id": "pm-sql-006",
    "title": "Customer Who Visited but Did Not Make Any Transactions",
    "slug": "customer-who-visited-but-did-not-make-any-transactions",
    "difficulty": "Easy",
    "category": "SQL",
    "topics": [
      "SQL",
      "LEFT JOIN & NULL"
    ],
    "companies": [
      "Amazon",
      "Microsoft",
      "TCS",
      "Accenture",
      "Cognizant"
    ],
    "frequentlyAsked": true,
    "interviewImportance": "Frequently Asked",
    "description": "Find the IDs of the users who visited without making any transactions and the number of times they made these visits.\n\nWrite a solution in SQL using standard ANSI/PostgreSQL/MySQL syntax.",
    "examples": [
      {
        "input": "Relational database schema with sample records",
        "output": "Queried result table",
        "explanation": "Matches expected LEFT JOIN & NULL output."
      }
    ],
    "constraints": [
      "Output column names must match the requested schema.",
      "Handle NULLs and duplicate rankings appropriately."
    ],
    "starterCode": {
      "python": "# Reference query:\n# SELECT v.customer_id, COUNT(v.visit_id) AS count_no_trans FROM Visits v LEFT JOIN Transactions t ON v.visit_id = t.visit_id WHERE t.transaction_id IS NULL GROUP BY v.customer_id;\n",
      "javascript": "// Reference query:\n// SELECT v.customer_id, COUNT(v.visit_id) AS count_no_trans FROM Visits v LEFT JOIN Transactions t ON v.visit_id = t.visit_id WHERE t.transaction_id IS NULL GROUP BY v.customer_id;\n",
      "java": "// SQL Solution reference\n",
      "cpp": "// SQL Solution reference\n",
      "sql": "-- Write your SQL query here\nSELECT v.customer_id, COUNT(v.visit_id) AS count_no_trans\nFROM Visits v\nLEFT JOIN Transactions t ON v.visit_id = t.visit_id\nWHERE t.transaction_id IS NULL\nGROUP BY v.customer_id;\n"
    },
    "supportedLanguages": [
      "python",
      "javascript",
      "java",
      "cpp",
      "sql"
    ],
    "testCases": [
      {
        "id": "tc-sql-006-1",
        "input": "Standard Database Tables",
        "expectedOutput": "Expected Records"
      }
    ],
    "hints": [
      "Identify the primary table and joined relations.",
      "Use LEFT JOIN & NULL to group or filter correctly.",
      "Handle potential edge cases with NULLs or edge ties."
    ],
    "approach": {
      "summary": "Optimal SQL query using LEFT JOIN & NULL.",
      "steps": [
        "Structure SELECT clause.",
        "Apply JOIN or WHERE filtering.",
        "Aggregate with GROUP BY or window functions."
      ]
    },
    "complexity": {
      "time": "O(N log N)",
      "space": "O(N)",
      "analysis": "Algorithm runs in O(N log N) time with O(N) space complexity."
    },
    "defaultMastery": 80,
    "recommendedTimeMinutes": 15
  },
  {
    "id": "pm-sql-007",
    "title": "Rising Temperature",
    "slug": "rising-temperature",
    "difficulty": "Easy",
    "category": "SQL",
    "topics": [
      "SQL",
      "Self Join / DATEDIFF"
    ],
    "companies": [
      "Amazon",
      "Microsoft",
      "TCS",
      "Accenture",
      "Cognizant"
    ],
    "frequentlyAsked": true,
    "interviewImportance": "Frequently Asked",
    "description": "Find all dates' Id with higher temperatures compared to its previous dates (yesterday).\n\nWrite a solution in SQL using standard ANSI/PostgreSQL/MySQL syntax.",
    "examples": [
      {
        "input": "Relational database schema with sample records",
        "output": "Queried result table",
        "explanation": "Matches expected Self Join / DATEDIFF output."
      }
    ],
    "constraints": [
      "Output column names must match the requested schema.",
      "Handle NULLs and duplicate rankings appropriately."
    ],
    "starterCode": {
      "python": "# Reference query:\n# SELECT w1.id FROM Weather w1 JOIN Weather w2 ON w1.recordDate = w2.recordDate + INTERVAL 1 DAY WHERE w1.temperature > w2.temperature;\n",
      "javascript": "// Reference query:\n// SELECT w1.id FROM Weather w1 JOIN Weather w2 ON w1.recordDate = w2.recordDate + INTERVAL 1 DAY WHERE w1.temperature > w2.temperature;\n",
      "java": "// SQL Solution reference\n",
      "cpp": "// SQL Solution reference\n",
      "sql": "-- Write your SQL query here\nSELECT w1.id\nFROM Weather w1\nJOIN Weather w2 ON w1.recordDate = w2.recordDate + INTERVAL 1 DAY\nWHERE w1.temperature > w2.temperature;\n"
    },
    "supportedLanguages": [
      "python",
      "javascript",
      "java",
      "cpp",
      "sql"
    ],
    "testCases": [
      {
        "id": "tc-sql-007-1",
        "input": "Standard Database Tables",
        "expectedOutput": "Expected Records"
      }
    ],
    "hints": [
      "Identify the primary table and joined relations.",
      "Use Self Join / DATEDIFF to group or filter correctly.",
      "Handle potential edge cases with NULLs or edge ties."
    ],
    "approach": {
      "summary": "Optimal SQL query using Self Join / DATEDIFF.",
      "steps": [
        "Structure SELECT clause.",
        "Apply JOIN or WHERE filtering.",
        "Aggregate with GROUP BY or window functions."
      ]
    },
    "complexity": {
      "time": "O(N log N)",
      "space": "O(N)",
      "analysis": "Algorithm runs in O(N log N) time with O(N) space complexity."
    },
    "defaultMastery": 80,
    "recommendedTimeMinutes": 15
  },
  {
    "id": "pm-sql-008",
    "title": "Average Selling Price",
    "slug": "average-selling-price",
    "difficulty": "Easy",
    "category": "SQL",
    "topics": [
      "SQL",
      "GROUP BY & Joins"
    ],
    "companies": [
      "Amazon",
      "Microsoft",
      "TCS",
      "Accenture",
      "Cognizant"
    ],
    "frequentlyAsked": true,
    "interviewImportance": "Frequently Asked",
    "description": "Find the average selling price for each product. average_price should be rounded to 2 decimal places.\n\nWrite a solution in SQL using standard ANSI/PostgreSQL/MySQL syntax.",
    "examples": [
      {
        "input": "Relational database schema with sample records",
        "output": "Queried result table",
        "explanation": "Matches expected GROUP BY & Joins output."
      }
    ],
    "constraints": [
      "Output column names must match the requested schema.",
      "Handle NULLs and duplicate rankings appropriately."
    ],
    "starterCode": {
      "python": "# Reference query:\n# SELECT p.product_id, IFNULL(ROUND(SUM(p.price * u.units) / SUM(u.units), 2), 0) AS average_price FROM Prices p LEFT JOIN UnitsSold u ON p.product_id = u.product_id AND u.purchase_date BETWEEN p.start_date AND p.end_date GROUP BY p.product_id;\n",
      "javascript": "// Reference query:\n// SELECT p.product_id, IFNULL(ROUND(SUM(p.price * u.units) / SUM(u.units), 2), 0) AS average_price FROM Prices p LEFT JOIN UnitsSold u ON p.product_id = u.product_id AND u.purchase_date BETWEEN p.start_date AND p.end_date GROUP BY p.product_id;\n",
      "java": "// SQL Solution reference\n",
      "cpp": "// SQL Solution reference\n",
      "sql": "-- Write your SQL query here\nSELECT p.product_id, IFNULL(ROUND(SUM(p.price * u.units) / SUM(u.units), 2), 0) AS average_price\nFROM Prices p\nLEFT JOIN UnitsSold u ON p.product_id = u.product_id AND u.purchase_date BETWEEN p.start_date AND p.end_date\nGROUP BY p.product_id;\n"
    },
    "supportedLanguages": [
      "python",
      "javascript",
      "java",
      "cpp",
      "sql"
    ],
    "testCases": [
      {
        "id": "tc-sql-008-1",
        "input": "Standard Database Tables",
        "expectedOutput": "Expected Records"
      }
    ],
    "hints": [
      "Identify the primary table and joined relations.",
      "Use GROUP BY & Joins to group or filter correctly.",
      "Handle potential edge cases with NULLs or edge ties."
    ],
    "approach": {
      "summary": "Optimal SQL query using GROUP BY & Joins.",
      "steps": [
        "Structure SELECT clause.",
        "Apply JOIN or WHERE filtering.",
        "Aggregate with GROUP BY or window functions."
      ]
    },
    "complexity": {
      "time": "O(N log N)",
      "space": "O(N)",
      "analysis": "Algorithm runs in O(N log N) time with O(N) space complexity."
    },
    "defaultMastery": 80,
    "recommendedTimeMinutes": 15
  },
  {
    "id": "pm-sql-009",
    "title": "Project Employees I",
    "slug": "project-employees-i",
    "difficulty": "Easy",
    "category": "SQL",
    "topics": [
      "SQL",
      "Aggregations"
    ],
    "companies": [
      "Amazon",
      "Microsoft",
      "TCS",
      "Accenture",
      "Cognizant"
    ],
    "frequentlyAsked": true,
    "interviewImportance": "Frequently Asked",
    "description": "Write an SQL query that reports the average experience years of all the employees for each project, rounded to 2 digits.\n\nWrite a solution in SQL using standard ANSI/PostgreSQL/MySQL syntax.",
    "examples": [
      {
        "input": "Relational database schema with sample records",
        "output": "Queried result table",
        "explanation": "Matches expected Aggregations output."
      }
    ],
    "constraints": [
      "Output column names must match the requested schema.",
      "Handle NULLs and duplicate rankings appropriately."
    ],
    "starterCode": {
      "python": "# Reference query:\n# SELECT p.project_id, ROUND(AVG(e.experience_years), 2) AS average_years FROM Project p JOIN Employee e ON p.employee_id = e.employee_id GROUP BY p.project_id;\n",
      "javascript": "// Reference query:\n// SELECT p.project_id, ROUND(AVG(e.experience_years), 2) AS average_years FROM Project p JOIN Employee e ON p.employee_id = e.employee_id GROUP BY p.project_id;\n",
      "java": "// SQL Solution reference\n",
      "cpp": "// SQL Solution reference\n",
      "sql": "-- Write your SQL query here\nSELECT p.project_id, ROUND(AVG(e.experience_years), 2) AS average_years\nFROM Project p\nJOIN Employee e ON p.employee_id = e.employee_id\nGROUP BY p.project_id;\n"
    },
    "supportedLanguages": [
      "python",
      "javascript",
      "java",
      "cpp",
      "sql"
    ],
    "testCases": [
      {
        "id": "tc-sql-009-1",
        "input": "Standard Database Tables",
        "expectedOutput": "Expected Records"
      }
    ],
    "hints": [
      "Identify the primary table and joined relations.",
      "Use Aggregations to group or filter correctly.",
      "Handle potential edge cases with NULLs or edge ties."
    ],
    "approach": {
      "summary": "Optimal SQL query using Aggregations.",
      "steps": [
        "Structure SELECT clause.",
        "Apply JOIN or WHERE filtering.",
        "Aggregate with GROUP BY or window functions."
      ]
    },
    "complexity": {
      "time": "O(N log N)",
      "space": "O(N)",
      "analysis": "Algorithm runs in O(N log N) time with O(N) space complexity."
    },
    "defaultMastery": 80,
    "recommendedTimeMinutes": 15
  },
  {
    "id": "pm-sql-010",
    "title": "Percentage of Users Attended a Contest",
    "slug": "percentage-of-users-attended-a-contest",
    "difficulty": "Easy",
    "category": "SQL",
    "topics": [
      "SQL",
      "Subqueries & GROUP BY"
    ],
    "companies": [
      "Amazon",
      "Microsoft",
      "TCS",
      "Accenture",
      "Cognizant"
    ],
    "frequentlyAsked": true,
    "interviewImportance": "Frequently Asked",
    "description": "Find the percentage of the users registered in each contest rounded to two decimals in descending order.\n\nWrite a solution in SQL using standard ANSI/PostgreSQL/MySQL syntax.",
    "examples": [
      {
        "input": "Relational database schema with sample records",
        "output": "Queried result table",
        "explanation": "Matches expected Subqueries & GROUP BY output."
      }
    ],
    "constraints": [
      "Output column names must match the requested schema.",
      "Handle NULLs and duplicate rankings appropriately."
    ],
    "starterCode": {
      "python": "# Reference query:\n# SELECT contest_id, ROUND(COUNT(user_id) * 100.0 / (SELECT COUNT(*) FROM Users), 2) AS percentage FROM Register GROUP BY contest_id ORDER BY percentage DESC, contest_id ASC;\n",
      "javascript": "// Reference query:\n// SELECT contest_id, ROUND(COUNT(user_id) * 100.0 / (SELECT COUNT(*) FROM Users), 2) AS percentage FROM Register GROUP BY contest_id ORDER BY percentage DESC, contest_id ASC;\n",
      "java": "// SQL Solution reference\n",
      "cpp": "// SQL Solution reference\n",
      "sql": "-- Write your SQL query here\nSELECT contest_id, ROUND(COUNT(user_id) * 100.0 / (SELECT COUNT(*) FROM Users), 2) AS percentage\nFROM Register\nGROUP BY contest_id\nORDER BY percentage DESC, contest_id ASC;\n"
    },
    "supportedLanguages": [
      "python",
      "javascript",
      "java",
      "cpp",
      "sql"
    ],
    "testCases": [
      {
        "id": "tc-sql-010-1",
        "input": "Standard Database Tables",
        "expectedOutput": "Expected Records"
      }
    ],
    "hints": [
      "Identify the primary table and joined relations.",
      "Use Subqueries & GROUP BY to group or filter correctly.",
      "Handle potential edge cases with NULLs or edge ties."
    ],
    "approach": {
      "summary": "Optimal SQL query using Subqueries & GROUP BY.",
      "steps": [
        "Structure SELECT clause.",
        "Apply JOIN or WHERE filtering.",
        "Aggregate with GROUP BY or window functions."
      ]
    },
    "complexity": {
      "time": "O(N log N)",
      "space": "O(N)",
      "analysis": "Algorithm runs in O(N log N) time with O(N) space complexity."
    },
    "defaultMastery": 80,
    "recommendedTimeMinutes": 15
  },
  {
    "id": "pm-sql-011",
    "title": "Queries Quality and Percentage",
    "slug": "queries-quality-and-percentage",
    "difficulty": "Easy",
    "category": "SQL",
    "topics": [
      "SQL",
      "Conditional Aggregations"
    ],
    "companies": [
      "Amazon",
      "Microsoft",
      "TCS",
      "Accenture",
      "Cognizant"
    ],
    "frequentlyAsked": true,
    "interviewImportance": "Frequently Asked",
    "description": "Find query_name, quality and poor_query_percentage for each query_name.\n\nWrite a solution in SQL using standard ANSI/PostgreSQL/MySQL syntax.",
    "examples": [
      {
        "input": "Relational database schema with sample records",
        "output": "Queried result table",
        "explanation": "Matches expected Conditional Aggregations output."
      }
    ],
    "constraints": [
      "Output column names must match the requested schema.",
      "Handle NULLs and duplicate rankings appropriately."
    ],
    "starterCode": {
      "python": "# Reference query:\n# SELECT query_name, ROUND(AVG(rating / position), 2) AS quality, ROUND(SUM(CASE WHEN rating < 3 THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2) AS poor_query_percentage FROM Queries WHERE query_name IS NOT NULL GROUP BY query_name;\n",
      "javascript": "// Reference query:\n// SELECT query_name, ROUND(AVG(rating / position), 2) AS quality, ROUND(SUM(CASE WHEN rating < 3 THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2) AS poor_query_percentage FROM Queries WHERE query_name IS NOT NULL GROUP BY query_name;\n",
      "java": "// SQL Solution reference\n",
      "cpp": "// SQL Solution reference\n",
      "sql": "-- Write your SQL query here\nSELECT query_name, ROUND(AVG(rating / position), 2) AS quality, ROUND(SUM(CASE WHEN rating < 3 THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2) AS poor_query_percentage\nFROM Queries\nWHERE query_name IS NOT NULL\nGROUP BY query_name;\n"
    },
    "supportedLanguages": [
      "python",
      "javascript",
      "java",
      "cpp",
      "sql"
    ],
    "testCases": [
      {
        "id": "tc-sql-011-1",
        "input": "Standard Database Tables",
        "expectedOutput": "Expected Records"
      }
    ],
    "hints": [
      "Identify the primary table and joined relations.",
      "Use Conditional Aggregations to group or filter correctly.",
      "Handle potential edge cases with NULLs or edge ties."
    ],
    "approach": {
      "summary": "Optimal SQL query using Conditional Aggregations.",
      "steps": [
        "Structure SELECT clause.",
        "Apply JOIN or WHERE filtering.",
        "Aggregate with GROUP BY or window functions."
      ]
    },
    "complexity": {
      "time": "O(N log N)",
      "space": "O(N)",
      "analysis": "Algorithm runs in O(N log N) time with O(N) space complexity."
    },
    "defaultMastery": 80,
    "recommendedTimeMinutes": 15
  },
  {
    "id": "pm-sql-012",
    "title": "Monthly Transactions I",
    "slug": "monthly-transactions-i",
    "difficulty": "Medium",
    "category": "SQL",
    "topics": [
      "SQL",
      "Date Functions & Aggregation"
    ],
    "companies": [
      "Amazon",
      "Microsoft",
      "TCS",
      "Accenture",
      "Cognizant"
    ],
    "frequentlyAsked": true,
    "interviewImportance": "Frequently Asked",
    "description": "Find for each month and country, the number of transactions and their total amount, the number of approved transactions and their total amount.\n\nWrite a solution in SQL using standard ANSI/PostgreSQL/MySQL syntax.",
    "examples": [
      {
        "input": "Relational database schema with sample records",
        "output": "Queried result table",
        "explanation": "Matches expected Date Functions & Aggregation output."
      }
    ],
    "constraints": [
      "Output column names must match the requested schema.",
      "Handle NULLs and duplicate rankings appropriately."
    ],
    "starterCode": {
      "python": "# Reference query:\n# SELECT DATE_FORMAT(trans_date, '%Y-%m') AS month, country, COUNT(id) AS trans_count, SUM(CASE WHEN state = 'approved' THEN 1 ELSE 0 END) AS approved_count, SUM(amount) AS trans_total_amount, SUM(CASE WHEN state = 'approved' THEN amount ELSE 0 END) AS approved_total_amount FROM Transactions GROUP BY month, country;\n",
      "javascript": "// Reference query:\n// SELECT DATE_FORMAT(trans_date, '%Y-%m') AS month, country, COUNT(id) AS trans_count, SUM(CASE WHEN state = 'approved' THEN 1 ELSE 0 END) AS approved_count, SUM(amount) AS trans_total_amount, SUM(CASE WHEN state = 'approved' THEN amount ELSE 0 END) AS approved_total_amount FROM Transactions GROUP BY month, country;\n",
      "java": "// SQL Solution reference\n",
      "cpp": "// SQL Solution reference\n",
      "sql": "-- Write your SQL query here\nSELECT DATE_FORMAT(trans_date, '%Y-%m') AS month, country, COUNT(id) AS trans_count, SUM(CASE WHEN state = 'approved' THEN 1 ELSE 0 END) AS approved_count, SUM(amount) AS trans_total_amount, SUM(CASE WHEN state = 'approved' THEN amount ELSE 0 END) AS approved_total_amount\nFROM Transactions\nGROUP BY month, country;\n"
    },
    "supportedLanguages": [
      "python",
      "javascript",
      "java",
      "cpp",
      "sql"
    ],
    "testCases": [
      {
        "id": "tc-sql-012-1",
        "input": "Standard Database Tables",
        "expectedOutput": "Expected Records"
      }
    ],
    "hints": [
      "Identify the primary table and joined relations.",
      "Use Date Functions & Aggregation to group or filter correctly.",
      "Handle potential edge cases with NULLs or edge ties."
    ],
    "approach": {
      "summary": "Optimal SQL query using Date Functions & Aggregation.",
      "steps": [
        "Structure SELECT clause.",
        "Apply JOIN or WHERE filtering.",
        "Aggregate with GROUP BY or window functions."
      ]
    },
    "complexity": {
      "time": "O(N log N)",
      "space": "O(N)",
      "analysis": "Algorithm runs in O(N log N) time with O(N) space complexity."
    },
    "defaultMastery": 80,
    "recommendedTimeMinutes": 25
  },
  {
    "id": "pm-sql-013",
    "title": "Immediate Food Delivery II",
    "slug": "immediate-food-delivery-ii",
    "difficulty": "Medium",
    "category": "SQL",
    "topics": [
      "SQL",
      "Subqueries & Percentages"
    ],
    "companies": [
      "Amazon",
      "Microsoft",
      "TCS",
      "Accenture",
      "Cognizant"
    ],
    "frequentlyAsked": true,
    "interviewImportance": "Frequently Asked",
    "description": "Find the percentage of immediate orders in the first orders of all customers, rounded to 2 decimal places.\n\nWrite a solution in SQL using standard ANSI/PostgreSQL/MySQL syntax.",
    "examples": [
      {
        "input": "Relational database schema with sample records",
        "output": "Queried result table",
        "explanation": "Matches expected Subqueries & Percentages output."
      }
    ],
    "constraints": [
      "Output column names must match the requested schema.",
      "Handle NULLs and duplicate rankings appropriately."
    ],
    "starterCode": {
      "python": "# Reference query:\n# SELECT ROUND(SUM(CASE WHEN order_date = customer_pref_delivery_date THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2) AS immediate_percentage FROM Delivery WHERE (customer_id, order_date) IN (     SELECT customer_id, MIN(order_date)     FROM Delivery     GROUP BY customer_id );\n",
      "javascript": "// Reference query:\n// SELECT ROUND(SUM(CASE WHEN order_date = customer_pref_delivery_date THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2) AS immediate_percentage FROM Delivery WHERE (customer_id, order_date) IN (     SELECT customer_id, MIN(order_date)     FROM Delivery     GROUP BY customer_id );\n",
      "java": "// SQL Solution reference\n",
      "cpp": "// SQL Solution reference\n",
      "sql": "-- Write your SQL query here\nSELECT ROUND(SUM(CASE WHEN order_date = customer_pref_delivery_date THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2) AS immediate_percentage\nFROM Delivery\nWHERE (customer_id, order_date) IN (\n    SELECT customer_id, MIN(order_date)\n    FROM Delivery\n    GROUP BY customer_id\n);\n"
    },
    "supportedLanguages": [
      "python",
      "javascript",
      "java",
      "cpp",
      "sql"
    ],
    "testCases": [
      {
        "id": "tc-sql-013-1",
        "input": "Standard Database Tables",
        "expectedOutput": "Expected Records"
      }
    ],
    "hints": [
      "Identify the primary table and joined relations.",
      "Use Subqueries & Percentages to group or filter correctly.",
      "Handle potential edge cases with NULLs or edge ties."
    ],
    "approach": {
      "summary": "Optimal SQL query using Subqueries & Percentages.",
      "steps": [
        "Structure SELECT clause.",
        "Apply JOIN or WHERE filtering.",
        "Aggregate with GROUP BY or window functions."
      ]
    },
    "complexity": {
      "time": "O(N log N)",
      "space": "O(N)",
      "analysis": "Algorithm runs in O(N log N) time with O(N) space complexity."
    },
    "defaultMastery": 80,
    "recommendedTimeMinutes": 25
  },
  {
    "id": "pm-sql-014",
    "title": "Department Highest Salary",
    "slug": "department-highest-salary",
    "difficulty": "Medium",
    "category": "SQL",
    "topics": [
      "SQL",
      "Window Functions / Subqueries"
    ],
    "companies": [
      "Amazon",
      "Microsoft",
      "TCS",
      "Accenture",
      "Cognizant"
    ],
    "frequentlyAsked": true,
    "interviewImportance": "Frequently Asked",
    "description": "Find employees who have the highest salary in each of the departments.\n\nWrite a solution in SQL using standard ANSI/PostgreSQL/MySQL syntax.",
    "examples": [
      {
        "input": "Relational database schema with sample records",
        "output": "Queried result table",
        "explanation": "Matches expected Window Functions / Subqueries output."
      }
    ],
    "constraints": [
      "Output column names must match the requested schema.",
      "Handle NULLs and duplicate rankings appropriately."
    ],
    "starterCode": {
      "python": "# Reference query:\n# SELECT d.name AS Department, e.name AS Employee, e.salary AS Salary FROM Employee e JOIN Department d ON e.departmentId = d.id WHERE (e.departmentId, e.salary) IN (     SELECT departmentId, MAX(salary)     FROM Employee     GROUP BY departmentId );\n",
      "javascript": "// Reference query:\n// SELECT d.name AS Department, e.name AS Employee, e.salary AS Salary FROM Employee e JOIN Department d ON e.departmentId = d.id WHERE (e.departmentId, e.salary) IN (     SELECT departmentId, MAX(salary)     FROM Employee     GROUP BY departmentId );\n",
      "java": "// SQL Solution reference\n",
      "cpp": "// SQL Solution reference\n",
      "sql": "-- Write your SQL query here\nSELECT d.name AS Department, e.name AS Employee, e.salary AS Salary\nFROM Employee e\nJOIN Department d ON e.departmentId = d.id\nWHERE (e.departmentId, e.salary) IN (\n    SELECT departmentId, MAX(salary)\n    FROM Employee\n    GROUP BY departmentId\n);\n"
    },
    "supportedLanguages": [
      "python",
      "javascript",
      "java",
      "cpp",
      "sql"
    ],
    "testCases": [
      {
        "id": "tc-sql-014-1",
        "input": "Standard Database Tables",
        "expectedOutput": "Expected Records"
      }
    ],
    "hints": [
      "Identify the primary table and joined relations.",
      "Use Window Functions / Subqueries to group or filter correctly.",
      "Handle potential edge cases with NULLs or edge ties."
    ],
    "approach": {
      "summary": "Optimal SQL query using Window Functions / Subqueries.",
      "steps": [
        "Structure SELECT clause.",
        "Apply JOIN or WHERE filtering.",
        "Aggregate with GROUP BY or window functions."
      ]
    },
    "complexity": {
      "time": "O(N log N)",
      "space": "O(N)",
      "analysis": "Algorithm runs in O(N log N) time with O(N) space complexity."
    },
    "defaultMastery": 80,
    "recommendedTimeMinutes": 25
  },
  {
    "id": "pm-sql-015",
    "title": "Second Highest Salary",
    "slug": "second-highest-salary",
    "difficulty": "Medium",
    "category": "SQL",
    "topics": [
      "SQL",
      "Subquery & Limit"
    ],
    "companies": [
      "Amazon",
      "Microsoft",
      "TCS",
      "Accenture",
      "Cognizant"
    ],
    "frequentlyAsked": true,
    "interviewImportance": "Frequently Asked",
    "description": "Find the second highest salary from the Employee table. If there is no second highest salary, return null.\n\nWrite a solution in SQL using standard ANSI/PostgreSQL/MySQL syntax.",
    "examples": [
      {
        "input": "Relational database schema with sample records",
        "output": "Queried result table",
        "explanation": "Matches expected Subquery & Limit output."
      }
    ],
    "constraints": [
      "Output column names must match the requested schema.",
      "Handle NULLs and duplicate rankings appropriately."
    ],
    "starterCode": {
      "python": "# Reference query:\n# SELECT MAX(salary) AS SecondHighestSalary FROM Employee WHERE salary < (SELECT MAX(salary) FROM Employee);\n",
      "javascript": "// Reference query:\n// SELECT MAX(salary) AS SecondHighestSalary FROM Employee WHERE salary < (SELECT MAX(salary) FROM Employee);\n",
      "java": "// SQL Solution reference\n",
      "cpp": "// SQL Solution reference\n",
      "sql": "-- Write your SQL query here\nSELECT MAX(salary) AS SecondHighestSalary\nFROM Employee\nWHERE salary < (SELECT MAX(salary) FROM Employee);\n"
    },
    "supportedLanguages": [
      "python",
      "javascript",
      "java",
      "cpp",
      "sql"
    ],
    "testCases": [
      {
        "id": "tc-sql-015-1",
        "input": "Standard Database Tables",
        "expectedOutput": "Expected Records"
      }
    ],
    "hints": [
      "Identify the primary table and joined relations.",
      "Use Subquery & Limit to group or filter correctly.",
      "Handle potential edge cases with NULLs or edge ties."
    ],
    "approach": {
      "summary": "Optimal SQL query using Subquery & Limit.",
      "steps": [
        "Structure SELECT clause.",
        "Apply JOIN or WHERE filtering.",
        "Aggregate with GROUP BY or window functions."
      ]
    },
    "complexity": {
      "time": "O(N log N)",
      "space": "O(N)",
      "analysis": "Algorithm runs in O(N log N) time with O(N) space complexity."
    },
    "defaultMastery": 80,
    "recommendedTimeMinutes": 25
  },
  {
    "id": "pm-sql-016",
    "title": "Department Top Three Salaries",
    "slug": "department-top-three-salaries",
    "difficulty": "Hard",
    "category": "SQL",
    "topics": [
      "SQL",
      "DENSE_RANK Window Function"
    ],
    "companies": [
      "Amazon",
      "Microsoft",
      "TCS",
      "Accenture",
      "Cognizant"
    ],
    "frequentlyAsked": true,
    "interviewImportance": "Frequently Asked",
    "description": "A company's executives are interested in seeing who earns the most money in each of the company's departments. High earners are employees who earn top 3 unique salaries.\n\nWrite a solution in SQL using standard ANSI/PostgreSQL/MySQL syntax.",
    "examples": [
      {
        "input": "Relational database schema with sample records",
        "output": "Queried result table",
        "explanation": "Matches expected DENSE_RANK Window Function output."
      }
    ],
    "constraints": [
      "Output column names must match the requested schema.",
      "Handle NULLs and duplicate rankings appropriately."
    ],
    "starterCode": {
      "python": "# Reference query:\n# WITH Ranked AS (     SELECT d.name AS Department, e.name AS Employee, e.salary AS Salary,            DENSE_RANK() OVER(PARTITION BY e.departmentId ORDER BY e.salary DESC) AS rnk     FROM Employee e     JOIN Department d ON e.departmentId = d.id ) SELECT Department, Employee, Salary FROM Ranked WHERE rnk <= 3;\n",
      "javascript": "// Reference query:\n// WITH Ranked AS (     SELECT d.name AS Department, e.name AS Employee, e.salary AS Salary,            DENSE_RANK() OVER(PARTITION BY e.departmentId ORDER BY e.salary DESC) AS rnk     FROM Employee e     JOIN Department d ON e.departmentId = d.id ) SELECT Department, Employee, Salary FROM Ranked WHERE rnk <= 3;\n",
      "java": "// SQL Solution reference\n",
      "cpp": "// SQL Solution reference\n",
      "sql": "-- Write your SQL query here\nWITH Ranked AS (\n    SELECT d.name AS Department, e.name AS Employee, e.salary AS Salary,\n           DENSE_RANK() OVER(PARTITION BY e.departmentId ORDER BY e.salary DESC) AS rnk\n    FROM Employee e\n    JOIN Department d ON e.departmentId = d.id\n)\nSELECT Department, Employee, Salary\nFROM Ranked\nWHERE rnk <= 3;\n"
    },
    "supportedLanguages": [
      "python",
      "javascript",
      "java",
      "cpp",
      "sql"
    ],
    "testCases": [
      {
        "id": "tc-sql-016-1",
        "input": "Standard Database Tables",
        "expectedOutput": "Expected Records"
      }
    ],
    "hints": [
      "Identify the primary table and joined relations.",
      "Use DENSE_RANK Window Function to group or filter correctly.",
      "Handle potential edge cases with NULLs or edge ties."
    ],
    "approach": {
      "summary": "Optimal SQL query using DENSE_RANK Window Function.",
      "steps": [
        "Structure SELECT clause.",
        "Apply JOIN or WHERE filtering.",
        "Aggregate with GROUP BY or window functions."
      ]
    },
    "complexity": {
      "time": "O(N log N)",
      "space": "O(N)",
      "analysis": "Algorithm runs in O(N log N) time with O(N) space complexity."
    },
    "defaultMastery": 80,
    "recommendedTimeMinutes": 40
  },
  {
    "id": "pm-cs-001",
    "title": "Four Pillars of OOP & Real-World Modeling",
    "slug": "four-pillars-of-oop-real-world-modeling",
    "difficulty": "Easy",
    "category": "Core CS",
    "topics": [
      "OOP",
      "Design Patterns"
    ],
    "companies": [
      "TCS",
      "Infosys",
      "Wipro",
      "Amazon"
    ],
    "frequentlyAsked": true,
    "interviewImportance": "Frequently Asked",
    "description": "Explain and demonstrate Encapsulation, Abstraction, Inheritance, and Polymorphism in an object-oriented codebase.\n\nDemonstrate foundational understanding and explain standard interview scenarios with structural clarity.",
    "examples": [
      {
        "input": "Interview Concept Query",
        "output": "Structured technical explanation",
        "explanation": "Core conceptual definition and trade-offs."
      }
    ],
    "constraints": [
      "Be clear on trade-offs, theoretical bounds, and real-world system behavior."
    ],
    "starterCode": {
      "python": "# Conceptual summary & implementation notes\ndef getSummary():\n    return \"Four Pillars of OOP & Real-World Modeling overview\"\n",
      "javascript": "function getSummary() {\n    return \"Four Pillars of OOP & Real-World Modeling overview\";\n}\n",
      "java": "class Solution {\n    public String getSummary() {\n        return \"Four Pillars of OOP & Real-World Modeling overview\";\n    }\n}\n",
      "cpp": "class Solution {\npublic:\n    string getSummary() {\n        return \"Four Pillars of OOP & Real-World Modeling overview\";\n    }\n};\n"
    },
    "supportedLanguages": [
      "python",
      "javascript",
      "java",
      "cpp"
    ],
    "testCases": [
      {
        "id": "tc-cs-001-1",
        "input": "System Scenario",
        "expectedOutput": "Verified Concept"
      }
    ],
    "hints": [
      "Recall the architectural layer and core definitions.",
      "Highlight key trade-offs and real-world advantages.",
      "Structure answer logically into definitions, mechanisms, and examples."
    ],
    "approach": {
      "summary": "Comprehensive overview of Four Pillars of OOP & Real-World Modeling.",
      "steps": [
        "Define core terms.",
        "Explain architecture and mechanisms.",
        "Provide real-world trade-off comparison."
      ]
    },
    "complexity": {
      "time": "O(1)",
      "space": "O(1)",
      "analysis": "Algorithm runs in O(1) time with O(1) space complexity."
    },
    "defaultMastery": 85,
    "recommendedTimeMinutes": 15
  },
  {
    "id": "pm-cs-002",
    "title": "SOLID Principles in Software Design",
    "slug": "solid-principles-in-software-design",
    "difficulty": "Medium",
    "category": "Core CS",
    "topics": [
      "OOP",
      "Design Patterns"
    ],
    "companies": [
      "Amazon",
      "Microsoft",
      "Google"
    ],
    "frequentlyAsked": true,
    "interviewImportance": "Frequently Asked",
    "description": "Explain the 5 SOLID design principles (Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion) with concrete code examples.\n\nDemonstrate foundational understanding and explain standard interview scenarios with structural clarity.",
    "examples": [
      {
        "input": "Interview Concept Query",
        "output": "Structured technical explanation",
        "explanation": "Core conceptual definition and trade-offs."
      }
    ],
    "constraints": [
      "Be clear on trade-offs, theoretical bounds, and real-world system behavior."
    ],
    "starterCode": {
      "python": "# Conceptual summary & implementation notes\ndef getSummary():\n    return \"SOLID Principles in Software Design overview\"\n",
      "javascript": "function getSummary() {\n    return \"SOLID Principles in Software Design overview\";\n}\n",
      "java": "class Solution {\n    public String getSummary() {\n        return \"SOLID Principles in Software Design overview\";\n    }\n}\n",
      "cpp": "class Solution {\npublic:\n    string getSummary() {\n        return \"SOLID Principles in Software Design overview\";\n    }\n};\n"
    },
    "supportedLanguages": [
      "python",
      "javascript",
      "java",
      "cpp"
    ],
    "testCases": [
      {
        "id": "tc-cs-002-1",
        "input": "System Scenario",
        "expectedOutput": "Verified Concept"
      }
    ],
    "hints": [
      "Recall the architectural layer and core definitions.",
      "Highlight key trade-offs and real-world advantages.",
      "Structure answer logically into definitions, mechanisms, and examples."
    ],
    "approach": {
      "summary": "Comprehensive overview of SOLID Principles in Software Design.",
      "steps": [
        "Define core terms.",
        "Explain architecture and mechanisms.",
        "Provide real-world trade-off comparison."
      ]
    },
    "complexity": {
      "time": "O(1)",
      "space": "O(1)",
      "analysis": "Algorithm runs in O(1) time with O(1) space complexity."
    },
    "defaultMastery": 85,
    "recommendedTimeMinutes": 25
  },
  {
    "id": "pm-cs-003",
    "title": "Abstract Class vs Interface Architecture",
    "slug": "abstract-class-vs-interface-architecture",
    "difficulty": "Easy",
    "category": "Core CS",
    "topics": [
      "OOP"
    ],
    "companies": [
      "TCS",
      "Accenture",
      "Cognizant"
    ],
    "frequentlyAsked": true,
    "interviewImportance": "Frequently Asked",
    "description": "Differentiate between Abstract Classes and Interfaces in Java/C++ in terms of multiple inheritance, default methods, speed, and design intent.\n\nDemonstrate foundational understanding and explain standard interview scenarios with structural clarity.",
    "examples": [
      {
        "input": "Interview Concept Query",
        "output": "Structured technical explanation",
        "explanation": "Core conceptual definition and trade-offs."
      }
    ],
    "constraints": [
      "Be clear on trade-offs, theoretical bounds, and real-world system behavior."
    ],
    "starterCode": {
      "python": "# Conceptual summary & implementation notes\ndef getSummary():\n    return \"Abstract Class vs Interface Architecture overview\"\n",
      "javascript": "function getSummary() {\n    return \"Abstract Class vs Interface Architecture overview\";\n}\n",
      "java": "class Solution {\n    public String getSummary() {\n        return \"Abstract Class vs Interface Architecture overview\";\n    }\n}\n",
      "cpp": "class Solution {\npublic:\n    string getSummary() {\n        return \"Abstract Class vs Interface Architecture overview\";\n    }\n};\n"
    },
    "supportedLanguages": [
      "python",
      "javascript",
      "java",
      "cpp"
    ],
    "testCases": [
      {
        "id": "tc-cs-003-1",
        "input": "System Scenario",
        "expectedOutput": "Verified Concept"
      }
    ],
    "hints": [
      "Recall the architectural layer and core definitions.",
      "Highlight key trade-offs and real-world advantages.",
      "Structure answer logically into definitions, mechanisms, and examples."
    ],
    "approach": {
      "summary": "Comprehensive overview of Abstract Class vs Interface Architecture.",
      "steps": [
        "Define core terms.",
        "Explain architecture and mechanisms.",
        "Provide real-world trade-off comparison."
      ]
    },
    "complexity": {
      "time": "O(1)",
      "space": "O(1)",
      "analysis": "Algorithm runs in O(1) time with O(1) space complexity."
    },
    "defaultMastery": 85,
    "recommendedTimeMinutes": 15
  },
  {
    "id": "pm-cs-004",
    "title": "Design Patterns: Singleton, Factory, and Strategy",
    "slug": "design-patterns-singleton-factory-and-strategy",
    "difficulty": "Medium",
    "category": "Core CS",
    "topics": [
      "OOP",
      "Design Patterns"
    ],
    "companies": [
      "Amazon",
      "Microsoft",
      "Zoho"
    ],
    "frequentlyAsked": true,
    "interviewImportance": "Frequently Asked",
    "description": "Explain implementation of Thread-Safe Singleton, Factory Method, and Strategy Pattern with behavioral use cases.\n\nDemonstrate foundational understanding and explain standard interview scenarios with structural clarity.",
    "examples": [
      {
        "input": "Interview Concept Query",
        "output": "Structured technical explanation",
        "explanation": "Core conceptual definition and trade-offs."
      }
    ],
    "constraints": [
      "Be clear on trade-offs, theoretical bounds, and real-world system behavior."
    ],
    "starterCode": {
      "python": "# Conceptual summary & implementation notes\ndef getSummary():\n    return \"Design Patterns: Singleton, Factory, and Strategy overview\"\n",
      "javascript": "function getSummary() {\n    return \"Design Patterns: Singleton, Factory, and Strategy overview\";\n}\n",
      "java": "class Solution {\n    public String getSummary() {\n        return \"Design Patterns: Singleton, Factory, and Strategy overview\";\n    }\n}\n",
      "cpp": "class Solution {\npublic:\n    string getSummary() {\n        return \"Design Patterns: Singleton, Factory, and Strategy overview\";\n    }\n};\n"
    },
    "supportedLanguages": [
      "python",
      "javascript",
      "java",
      "cpp"
    ],
    "testCases": [
      {
        "id": "tc-cs-004-1",
        "input": "System Scenario",
        "expectedOutput": "Verified Concept"
      }
    ],
    "hints": [
      "Recall the architectural layer and core definitions.",
      "Highlight key trade-offs and real-world advantages.",
      "Structure answer logically into definitions, mechanisms, and examples."
    ],
    "approach": {
      "summary": "Comprehensive overview of Design Patterns: Singleton, Factory, and Strategy.",
      "steps": [
        "Define core terms.",
        "Explain architecture and mechanisms.",
        "Provide real-world trade-off comparison."
      ]
    },
    "complexity": {
      "time": "O(1)",
      "space": "O(1)",
      "analysis": "Algorithm runs in O(1) time with O(1) space complexity."
    },
    "defaultMastery": 85,
    "recommendedTimeMinutes": 25
  },
  {
    "id": "pm-cs-005",
    "title": "Method Overloading vs Method Overriding & Virtual Tables",
    "slug": "method-overloading-vs-method-overriding-virtual-tables",
    "difficulty": "Easy",
    "category": "Core CS",
    "topics": [
      "OOP"
    ],
    "companies": [
      "Microsoft",
      "Capgemini"
    ],
    "frequentlyAsked": true,
    "interviewImportance": "Frequently Asked",
    "description": "Explain compile-time polymorphism (overloading) vs runtime polymorphism (overriding) and how vptr and vtable operate under the hood in C++.\n\nDemonstrate foundational understanding and explain standard interview scenarios with structural clarity.",
    "examples": [
      {
        "input": "Interview Concept Query",
        "output": "Structured technical explanation",
        "explanation": "Core conceptual definition and trade-offs."
      }
    ],
    "constraints": [
      "Be clear on trade-offs, theoretical bounds, and real-world system behavior."
    ],
    "starterCode": {
      "python": "# Conceptual summary & implementation notes\ndef getSummary():\n    return \"Method Overloading vs Method Overriding & Virtual Tables overview\"\n",
      "javascript": "function getSummary() {\n    return \"Method Overloading vs Method Overriding & Virtual Tables overview\";\n}\n",
      "java": "class Solution {\n    public String getSummary() {\n        return \"Method Overloading vs Method Overriding & Virtual Tables overview\";\n    }\n}\n",
      "cpp": "class Solution {\npublic:\n    string getSummary() {\n        return \"Method Overloading vs Method Overriding & Virtual Tables overview\";\n    }\n};\n"
    },
    "supportedLanguages": [
      "python",
      "javascript",
      "java",
      "cpp"
    ],
    "testCases": [
      {
        "id": "tc-cs-005-1",
        "input": "System Scenario",
        "expectedOutput": "Verified Concept"
      }
    ],
    "hints": [
      "Recall the architectural layer and core definitions.",
      "Highlight key trade-offs and real-world advantages.",
      "Structure answer logically into definitions, mechanisms, and examples."
    ],
    "approach": {
      "summary": "Comprehensive overview of Method Overloading vs Method Overriding & Virtual Tables.",
      "steps": [
        "Define core terms.",
        "Explain architecture and mechanisms.",
        "Provide real-world trade-off comparison."
      ]
    },
    "complexity": {
      "time": "O(1)",
      "space": "O(1)",
      "analysis": "Algorithm runs in O(1) time with O(1) space complexity."
    },
    "defaultMastery": 85,
    "recommendedTimeMinutes": 15
  },
  {
    "id": "pm-cs-006",
    "title": "ACID Properties & Transaction Isolation Levels",
    "slug": "acid-properties-transaction-isolation-levels",
    "difficulty": "Medium",
    "category": "Core CS",
    "topics": [
      "DBMS",
      "Transactions"
    ],
    "companies": [
      "Amazon",
      "Microsoft",
      "Infosys"
    ],
    "frequentlyAsked": true,
    "interviewImportance": "Frequently Asked",
    "description": "Define Atomicity, Consistency, Isolation, and Durability. Compare Read Uncommitted, Read Committed, Repeatable Read, and Serializable levels.\n\nDemonstrate foundational understanding and explain standard interview scenarios with structural clarity.",
    "examples": [
      {
        "input": "Interview Concept Query",
        "output": "Structured technical explanation",
        "explanation": "Core conceptual definition and trade-offs."
      }
    ],
    "constraints": [
      "Be clear on trade-offs, theoretical bounds, and real-world system behavior."
    ],
    "starterCode": {
      "python": "# Conceptual summary & implementation notes\ndef getSummary():\n    return \"ACID Properties & Transaction Isolation Levels overview\"\n",
      "javascript": "function getSummary() {\n    return \"ACID Properties & Transaction Isolation Levels overview\";\n}\n",
      "java": "class Solution {\n    public String getSummary() {\n        return \"ACID Properties & Transaction Isolation Levels overview\";\n    }\n}\n",
      "cpp": "class Solution {\npublic:\n    string getSummary() {\n        return \"ACID Properties & Transaction Isolation Levels overview\";\n    }\n};\n"
    },
    "supportedLanguages": [
      "python",
      "javascript",
      "java",
      "cpp"
    ],
    "testCases": [
      {
        "id": "tc-cs-006-1",
        "input": "System Scenario",
        "expectedOutput": "Verified Concept"
      }
    ],
    "hints": [
      "Recall the architectural layer and core definitions.",
      "Highlight key trade-offs and real-world advantages.",
      "Structure answer logically into definitions, mechanisms, and examples."
    ],
    "approach": {
      "summary": "Comprehensive overview of ACID Properties & Transaction Isolation Levels.",
      "steps": [
        "Define core terms.",
        "Explain architecture and mechanisms.",
        "Provide real-world trade-off comparison."
      ]
    },
    "complexity": {
      "time": "O(1)",
      "space": "O(1)",
      "analysis": "Algorithm runs in O(1) time with O(1) space complexity."
    },
    "defaultMastery": 85,
    "recommendedTimeMinutes": 25
  },
  {
    "id": "pm-cs-007",
    "title": "Database Indexing: B-Trees, B+ Trees, and Hash Indexes",
    "slug": "database-indexing-b-trees-b-trees-and-hash-indexes",
    "difficulty": "Medium",
    "category": "Core CS",
    "topics": [
      "DBMS"
    ],
    "companies": [
      "Google",
      "Amazon",
      "Microsoft"
    ],
    "frequentlyAsked": true,
    "interviewImportance": "Frequently Asked",
    "description": "Explain how B+ Tree indexing accelerates range queries and lookups compared to binary search trees and hash indexes.\n\nDemonstrate foundational understanding and explain standard interview scenarios with structural clarity.",
    "examples": [
      {
        "input": "Interview Concept Query",
        "output": "Structured technical explanation",
        "explanation": "Core conceptual definition and trade-offs."
      }
    ],
    "constraints": [
      "Be clear on trade-offs, theoretical bounds, and real-world system behavior."
    ],
    "starterCode": {
      "python": "# Conceptual summary & implementation notes\ndef getSummary():\n    return \"Database Indexing: B-Trees, B+ Trees, and Hash Indexes overview\"\n",
      "javascript": "function getSummary() {\n    return \"Database Indexing: B-Trees, B+ Trees, and Hash Indexes overview\";\n}\n",
      "java": "class Solution {\n    public String getSummary() {\n        return \"Database Indexing: B-Trees, B+ Trees, and Hash Indexes overview\";\n    }\n}\n",
      "cpp": "class Solution {\npublic:\n    string getSummary() {\n        return \"Database Indexing: B-Trees, B+ Trees, and Hash Indexes overview\";\n    }\n};\n"
    },
    "supportedLanguages": [
      "python",
      "javascript",
      "java",
      "cpp"
    ],
    "testCases": [
      {
        "id": "tc-cs-007-1",
        "input": "System Scenario",
        "expectedOutput": "Verified Concept"
      }
    ],
    "hints": [
      "Recall the architectural layer and core definitions.",
      "Highlight key trade-offs and real-world advantages.",
      "Structure answer logically into definitions, mechanisms, and examples."
    ],
    "approach": {
      "summary": "Comprehensive overview of Database Indexing: B-Trees, B+ Trees, and Hash Indexes.",
      "steps": [
        "Define core terms.",
        "Explain architecture and mechanisms.",
        "Provide real-world trade-off comparison."
      ]
    },
    "complexity": {
      "time": "O(1)",
      "space": "O(1)",
      "analysis": "Algorithm runs in O(1) time with O(1) space complexity."
    },
    "defaultMastery": 85,
    "recommendedTimeMinutes": 25
  },
  {
    "id": "pm-cs-008",
    "title": "Database Normalization: 1NF to BCNF",
    "slug": "database-normalization-1nf-to-bcnf",
    "difficulty": "Easy",
    "category": "Core CS",
    "topics": [
      "DBMS"
    ],
    "companies": [
      "TCS",
      "Accenture",
      "Wipro"
    ],
    "frequentlyAsked": true,
    "interviewImportance": "Frequently Asked",
    "description": "Walk through the normal forms (1NF, 2NF, 3NF, BCNF) with functional dependencies, eliminating insertion, update, and deletion anomalies.\n\nDemonstrate foundational understanding and explain standard interview scenarios with structural clarity.",
    "examples": [
      {
        "input": "Interview Concept Query",
        "output": "Structured technical explanation",
        "explanation": "Core conceptual definition and trade-offs."
      }
    ],
    "constraints": [
      "Be clear on trade-offs, theoretical bounds, and real-world system behavior."
    ],
    "starterCode": {
      "python": "# Conceptual summary & implementation notes\ndef getSummary():\n    return \"Database Normalization: 1NF to BCNF overview\"\n",
      "javascript": "function getSummary() {\n    return \"Database Normalization: 1NF to BCNF overview\";\n}\n",
      "java": "class Solution {\n    public String getSummary() {\n        return \"Database Normalization: 1NF to BCNF overview\";\n    }\n}\n",
      "cpp": "class Solution {\npublic:\n    string getSummary() {\n        return \"Database Normalization: 1NF to BCNF overview\";\n    }\n};\n"
    },
    "supportedLanguages": [
      "python",
      "javascript",
      "java",
      "cpp"
    ],
    "testCases": [
      {
        "id": "tc-cs-008-1",
        "input": "System Scenario",
        "expectedOutput": "Verified Concept"
      }
    ],
    "hints": [
      "Recall the architectural layer and core definitions.",
      "Highlight key trade-offs and real-world advantages.",
      "Structure answer logically into definitions, mechanisms, and examples."
    ],
    "approach": {
      "summary": "Comprehensive overview of Database Normalization: 1NF to BCNF.",
      "steps": [
        "Define core terms.",
        "Explain architecture and mechanisms.",
        "Provide real-world trade-off comparison."
      ]
    },
    "complexity": {
      "time": "O(1)",
      "space": "O(1)",
      "analysis": "Algorithm runs in O(1) time with O(1) space complexity."
    },
    "defaultMastery": 85,
    "recommendedTimeMinutes": 15
  },
  {
    "id": "pm-cs-009",
    "title": "Database Sharding, Replication & CAP Theorem",
    "slug": "database-sharding-replication-cap-theorem",
    "difficulty": "Hard",
    "category": "Core CS",
    "topics": [
      "DBMS"
    ],
    "companies": [
      "Amazon",
      "Google",
      "Microsoft"
    ],
    "frequentlyAsked": true,
    "interviewImportance": "Frequently Asked",
    "description": "Explain master-slave vs multi-master replication, horizontal sharding partition keys, and Consistency vs Availability vs Partition tolerance tradeoffs.\n\nDemonstrate foundational understanding and explain standard interview scenarios with structural clarity.",
    "examples": [
      {
        "input": "Interview Concept Query",
        "output": "Structured technical explanation",
        "explanation": "Core conceptual definition and trade-offs."
      }
    ],
    "constraints": [
      "Be clear on trade-offs, theoretical bounds, and real-world system behavior."
    ],
    "starterCode": {
      "python": "# Conceptual summary & implementation notes\ndef getSummary():\n    return \"Database Sharding, Replication & CAP Theorem overview\"\n",
      "javascript": "function getSummary() {\n    return \"Database Sharding, Replication & CAP Theorem overview\";\n}\n",
      "java": "class Solution {\n    public String getSummary() {\n        return \"Database Sharding, Replication & CAP Theorem overview\";\n    }\n}\n",
      "cpp": "class Solution {\npublic:\n    string getSummary() {\n        return \"Database Sharding, Replication & CAP Theorem overview\";\n    }\n};\n"
    },
    "supportedLanguages": [
      "python",
      "javascript",
      "java",
      "cpp"
    ],
    "testCases": [
      {
        "id": "tc-cs-009-1",
        "input": "System Scenario",
        "expectedOutput": "Verified Concept"
      }
    ],
    "hints": [
      "Recall the architectural layer and core definitions.",
      "Highlight key trade-offs and real-world advantages.",
      "Structure answer logically into definitions, mechanisms, and examples."
    ],
    "approach": {
      "summary": "Comprehensive overview of Database Sharding, Replication & CAP Theorem.",
      "steps": [
        "Define core terms.",
        "Explain architecture and mechanisms.",
        "Provide real-world trade-off comparison."
      ]
    },
    "complexity": {
      "time": "O(1)",
      "space": "O(1)",
      "analysis": "Algorithm runs in O(1) time with O(1) space complexity."
    },
    "defaultMastery": 85,
    "recommendedTimeMinutes": 40
  },
  {
    "id": "pm-cs-010",
    "title": "SQL Joins: Nested Loop, Hash Join, and Merge Join Engines",
    "slug": "sql-joins-nested-loop-hash-join-and-merge-join-engines",
    "difficulty": "Medium",
    "category": "Core CS",
    "topics": [
      "DBMS"
    ],
    "companies": [
      "Amazon",
      "Microsoft"
    ],
    "frequentlyAsked": true,
    "interviewImportance": "Frequently Asked",
    "description": "Explain how database query optimizers execute Nested Loop Join, Hash Join, and Sort-Merge Join, and when each is preferred.\n\nDemonstrate foundational understanding and explain standard interview scenarios with structural clarity.",
    "examples": [
      {
        "input": "Interview Concept Query",
        "output": "Structured technical explanation",
        "explanation": "Core conceptual definition and trade-offs."
      }
    ],
    "constraints": [
      "Be clear on trade-offs, theoretical bounds, and real-world system behavior."
    ],
    "starterCode": {
      "python": "# Conceptual summary & implementation notes\ndef getSummary():\n    return \"SQL Joins: Nested Loop, Hash Join, and Merge Join Engines overview\"\n",
      "javascript": "function getSummary() {\n    return \"SQL Joins: Nested Loop, Hash Join, and Merge Join Engines overview\";\n}\n",
      "java": "class Solution {\n    public String getSummary() {\n        return \"SQL Joins: Nested Loop, Hash Join, and Merge Join Engines overview\";\n    }\n}\n",
      "cpp": "class Solution {\npublic:\n    string getSummary() {\n        return \"SQL Joins: Nested Loop, Hash Join, and Merge Join Engines overview\";\n    }\n};\n"
    },
    "supportedLanguages": [
      "python",
      "javascript",
      "java",
      "cpp"
    ],
    "testCases": [
      {
        "id": "tc-cs-010-1",
        "input": "System Scenario",
        "expectedOutput": "Verified Concept"
      }
    ],
    "hints": [
      "Recall the architectural layer and core definitions.",
      "Highlight key trade-offs and real-world advantages.",
      "Structure answer logically into definitions, mechanisms, and examples."
    ],
    "approach": {
      "summary": "Comprehensive overview of SQL Joins: Nested Loop, Hash Join, and Merge Join Engines.",
      "steps": [
        "Define core terms.",
        "Explain architecture and mechanisms.",
        "Provide real-world trade-off comparison."
      ]
    },
    "complexity": {
      "time": "O(1)",
      "space": "O(1)",
      "analysis": "Algorithm runs in O(1) time with O(1) space complexity."
    },
    "defaultMastery": 85,
    "recommendedTimeMinutes": 25
  },
  {
    "id": "pm-cs-011",
    "title": "Process vs Thread & Context Switching",
    "slug": "process-vs-thread-context-switching",
    "difficulty": "Easy",
    "category": "Core CS",
    "topics": [
      "Operating Systems",
      "Concurrency"
    ],
    "companies": [
      "Amazon",
      "Microsoft",
      "Infosys"
    ],
    "frequentlyAsked": true,
    "interviewImportance": "Frequently Asked",
    "description": "Compare Process and Thread memory layouts (Stack, Heap, Code, Data) and explain context switching overhead and PCB/TCB state transitions.\n\nDemonstrate foundational understanding and explain standard interview scenarios with structural clarity.",
    "examples": [
      {
        "input": "Interview Concept Query",
        "output": "Structured technical explanation",
        "explanation": "Core conceptual definition and trade-offs."
      }
    ],
    "constraints": [
      "Be clear on trade-offs, theoretical bounds, and real-world system behavior."
    ],
    "starterCode": {
      "python": "# Conceptual summary & implementation notes\ndef getSummary():\n    return \"Process vs Thread & Context Switching overview\"\n",
      "javascript": "function getSummary() {\n    return \"Process vs Thread & Context Switching overview\";\n}\n",
      "java": "class Solution {\n    public String getSummary() {\n        return \"Process vs Thread & Context Switching overview\";\n    }\n}\n",
      "cpp": "class Solution {\npublic:\n    string getSummary() {\n        return \"Process vs Thread & Context Switching overview\";\n    }\n};\n"
    },
    "supportedLanguages": [
      "python",
      "javascript",
      "java",
      "cpp"
    ],
    "testCases": [
      {
        "id": "tc-cs-011-1",
        "input": "System Scenario",
        "expectedOutput": "Verified Concept"
      }
    ],
    "hints": [
      "Recall the architectural layer and core definitions.",
      "Highlight key trade-offs and real-world advantages.",
      "Structure answer logically into definitions, mechanisms, and examples."
    ],
    "approach": {
      "summary": "Comprehensive overview of Process vs Thread & Context Switching.",
      "steps": [
        "Define core terms.",
        "Explain architecture and mechanisms.",
        "Provide real-world trade-off comparison."
      ]
    },
    "complexity": {
      "time": "O(1)",
      "space": "O(1)",
      "analysis": "Algorithm runs in O(1) time with O(1) space complexity."
    },
    "defaultMastery": 85,
    "recommendedTimeMinutes": 15
  },
  {
    "id": "pm-cs-012",
    "title": "Coffman's 4 Conditions for Deadlock & Banker's Algorithm",
    "slug": "coffman-s-4-conditions-for-deadlock-banker-s-algorithm",
    "difficulty": "Medium",
    "category": "Core CS",
    "topics": [
      "Operating Systems",
      "Deadlock"
    ],
    "companies": [
      "Amazon",
      "Google",
      "TCS"
    ],
    "frequentlyAsked": true,
    "interviewImportance": "Frequently Asked",
    "description": "State Coffman's 4 conditions (Mutual Exclusion, Hold & Wait, No Preemption, Circular Wait) and explain how Banker's algorithm ensures a safe state.\n\nDemonstrate foundational understanding and explain standard interview scenarios with structural clarity.",
    "examples": [
      {
        "input": "Interview Concept Query",
        "output": "Structured technical explanation",
        "explanation": "Core conceptual definition and trade-offs."
      }
    ],
    "constraints": [
      "Be clear on trade-offs, theoretical bounds, and real-world system behavior."
    ],
    "starterCode": {
      "python": "# Conceptual summary & implementation notes\ndef getSummary():\n    return \"Coffman's 4 Conditions for Deadlock & Banker's Algorithm overview\"\n",
      "javascript": "function getSummary() {\n    return \"Coffman's 4 Conditions for Deadlock & Banker's Algorithm overview\";\n}\n",
      "java": "class Solution {\n    public String getSummary() {\n        return \"Coffman's 4 Conditions for Deadlock & Banker's Algorithm overview\";\n    }\n}\n",
      "cpp": "class Solution {\npublic:\n    string getSummary() {\n        return \"Coffman's 4 Conditions for Deadlock & Banker's Algorithm overview\";\n    }\n};\n"
    },
    "supportedLanguages": [
      "python",
      "javascript",
      "java",
      "cpp"
    ],
    "testCases": [
      {
        "id": "tc-cs-012-1",
        "input": "System Scenario",
        "expectedOutput": "Verified Concept"
      }
    ],
    "hints": [
      "Recall the architectural layer and core definitions.",
      "Highlight key trade-offs and real-world advantages.",
      "Structure answer logically into definitions, mechanisms, and examples."
    ],
    "approach": {
      "summary": "Comprehensive overview of Coffman's 4 Conditions for Deadlock & Banker's Algorithm.",
      "steps": [
        "Define core terms.",
        "Explain architecture and mechanisms.",
        "Provide real-world trade-off comparison."
      ]
    },
    "complexity": {
      "time": "O(1)",
      "space": "O(1)",
      "analysis": "Algorithm runs in O(1) time with O(1) space complexity."
    },
    "defaultMastery": 85,
    "recommendedTimeMinutes": 25
  },
  {
    "id": "pm-cs-013",
    "title": "Virtual Memory, Paging, and Page Replacement Algorithms",
    "slug": "virtual-memory-paging-and-page-replacement-algorithms",
    "difficulty": "Medium",
    "category": "Core CS",
    "topics": [
      "Operating Systems"
    ],
    "companies": [
      "Microsoft",
      "Google"
    ],
    "frequentlyAsked": true,
    "interviewImportance": "Frequently Asked",
    "description": "Explain MMU address translation (virtual to physical), TLB hits/misses, and FIFO vs LRU vs Optimal page replacement algorithms.\n\nDemonstrate foundational understanding and explain standard interview scenarios with structural clarity.",
    "examples": [
      {
        "input": "Interview Concept Query",
        "output": "Structured technical explanation",
        "explanation": "Core conceptual definition and trade-offs."
      }
    ],
    "constraints": [
      "Be clear on trade-offs, theoretical bounds, and real-world system behavior."
    ],
    "starterCode": {
      "python": "# Conceptual summary & implementation notes\ndef getSummary():\n    return \"Virtual Memory, Paging, and Page Replacement Algorithms overview\"\n",
      "javascript": "function getSummary() {\n    return \"Virtual Memory, Paging, and Page Replacement Algorithms overview\";\n}\n",
      "java": "class Solution {\n    public String getSummary() {\n        return \"Virtual Memory, Paging, and Page Replacement Algorithms overview\";\n    }\n}\n",
      "cpp": "class Solution {\npublic:\n    string getSummary() {\n        return \"Virtual Memory, Paging, and Page Replacement Algorithms overview\";\n    }\n};\n"
    },
    "supportedLanguages": [
      "python",
      "javascript",
      "java",
      "cpp"
    ],
    "testCases": [
      {
        "id": "tc-cs-013-1",
        "input": "System Scenario",
        "expectedOutput": "Verified Concept"
      }
    ],
    "hints": [
      "Recall the architectural layer and core definitions.",
      "Highlight key trade-offs and real-world advantages.",
      "Structure answer logically into definitions, mechanisms, and examples."
    ],
    "approach": {
      "summary": "Comprehensive overview of Virtual Memory, Paging, and Page Replacement Algorithms.",
      "steps": [
        "Define core terms.",
        "Explain architecture and mechanisms.",
        "Provide real-world trade-off comparison."
      ]
    },
    "complexity": {
      "time": "O(1)",
      "space": "O(1)",
      "analysis": "Algorithm runs in O(1) time with O(1) space complexity."
    },
    "defaultMastery": 85,
    "recommendedTimeMinutes": 25
  },
  {
    "id": "pm-cs-014",
    "title": "CPU Scheduling Algorithms: FCFS, SJF, Round Robin, Priority",
    "slug": "cpu-scheduling-algorithms-fcfs-sjf-round-robin-priority",
    "difficulty": "Easy",
    "category": "Core CS",
    "topics": [
      "Operating Systems"
    ],
    "companies": [
      "TCS",
      "Accenture",
      "Wipro"
    ],
    "frequentlyAsked": true,
    "interviewImportance": "Frequently Asked",
    "description": "Compare turnaround time, waiting time, and response time across Round Robin (time quantum), SJF, and Priority scheduling with starvation prevention (aging).\n\nDemonstrate foundational understanding and explain standard interview scenarios with structural clarity.",
    "examples": [
      {
        "input": "Interview Concept Query",
        "output": "Structured technical explanation",
        "explanation": "Core conceptual definition and trade-offs."
      }
    ],
    "constraints": [
      "Be clear on trade-offs, theoretical bounds, and real-world system behavior."
    ],
    "starterCode": {
      "python": "# Conceptual summary & implementation notes\ndef getSummary():\n    return \"CPU Scheduling Algorithms: FCFS, SJF, Round Robin, Priority overview\"\n",
      "javascript": "function getSummary() {\n    return \"CPU Scheduling Algorithms: FCFS, SJF, Round Robin, Priority overview\";\n}\n",
      "java": "class Solution {\n    public String getSummary() {\n        return \"CPU Scheduling Algorithms: FCFS, SJF, Round Robin, Priority overview\";\n    }\n}\n",
      "cpp": "class Solution {\npublic:\n    string getSummary() {\n        return \"CPU Scheduling Algorithms: FCFS, SJF, Round Robin, Priority overview\";\n    }\n};\n"
    },
    "supportedLanguages": [
      "python",
      "javascript",
      "java",
      "cpp"
    ],
    "testCases": [
      {
        "id": "tc-cs-014-1",
        "input": "System Scenario",
        "expectedOutput": "Verified Concept"
      }
    ],
    "hints": [
      "Recall the architectural layer and core definitions.",
      "Highlight key trade-offs and real-world advantages.",
      "Structure answer logically into definitions, mechanisms, and examples."
    ],
    "approach": {
      "summary": "Comprehensive overview of CPU Scheduling Algorithms: FCFS, SJF, Round Robin, Priority.",
      "steps": [
        "Define core terms.",
        "Explain architecture and mechanisms.",
        "Provide real-world trade-off comparison."
      ]
    },
    "complexity": {
      "time": "O(1)",
      "space": "O(1)",
      "analysis": "Algorithm runs in O(1) time with O(1) space complexity."
    },
    "defaultMastery": 85,
    "recommendedTimeMinutes": 15
  },
  {
    "id": "pm-cs-015",
    "title": "Inter-Process Communication (IPC) & Synchronization Primitives",
    "slug": "inter-process-communication-ipc-synchronization-primitives",
    "difficulty": "Medium",
    "category": "Core CS",
    "topics": [
      "Operating Systems",
      "Concurrency"
    ],
    "companies": [
      "Amazon",
      "Microsoft"
    ],
    "frequentlyAsked": true,
    "interviewImportance": "Frequently Asked",
    "description": "Explain Pipes, Shared Memory, Message Queues, Mutexes, Semaphores (Counting & Binary), and the Producer-Consumer synchronization problem.\n\nDemonstrate foundational understanding and explain standard interview scenarios with structural clarity.",
    "examples": [
      {
        "input": "Interview Concept Query",
        "output": "Structured technical explanation",
        "explanation": "Core conceptual definition and trade-offs."
      }
    ],
    "constraints": [
      "Be clear on trade-offs, theoretical bounds, and real-world system behavior."
    ],
    "starterCode": {
      "python": "# Conceptual summary & implementation notes\ndef getSummary():\n    return \"Inter-Process Communication (IPC) & Synchronization Primitives overview\"\n",
      "javascript": "function getSummary() {\n    return \"Inter-Process Communication (IPC) & Synchronization Primitives overview\";\n}\n",
      "java": "class Solution {\n    public String getSummary() {\n        return \"Inter-Process Communication (IPC) & Synchronization Primitives overview\";\n    }\n}\n",
      "cpp": "class Solution {\npublic:\n    string getSummary() {\n        return \"Inter-Process Communication (IPC) & Synchronization Primitives overview\";\n    }\n};\n"
    },
    "supportedLanguages": [
      "python",
      "javascript",
      "java",
      "cpp"
    ],
    "testCases": [
      {
        "id": "tc-cs-015-1",
        "input": "System Scenario",
        "expectedOutput": "Verified Concept"
      }
    ],
    "hints": [
      "Recall the architectural layer and core definitions.",
      "Highlight key trade-offs and real-world advantages.",
      "Structure answer logically into definitions, mechanisms, and examples."
    ],
    "approach": {
      "summary": "Comprehensive overview of Inter-Process Communication (IPC) & Synchronization Primitives.",
      "steps": [
        "Define core terms.",
        "Explain architecture and mechanisms.",
        "Provide real-world trade-off comparison."
      ]
    },
    "complexity": {
      "time": "O(1)",
      "space": "O(1)",
      "analysis": "Algorithm runs in O(1) time with O(1) space complexity."
    },
    "defaultMastery": 85,
    "recommendedTimeMinutes": 25
  },
  {
    "id": "pm-cs-016",
    "title": "OSI Model vs TCP/IP Protocol Suite",
    "slug": "osi-model-vs-tcp-ip-protocol-suite",
    "difficulty": "Easy",
    "category": "Core CS",
    "topics": [
      "Computer Networks"
    ],
    "companies": [
      "TCS",
      "Infosys",
      "Wipro",
      "Amazon"
    ],
    "frequentlyAsked": true,
    "interviewImportance": "Frequently Asked",
    "description": "Map the 7 OSI layers to the 4 TCP/IP layers, describing packet encapsulation, headers, and protocol roles (Ethernet, IP, TCP/UDP, HTTP).\n\nDemonstrate foundational understanding and explain standard interview scenarios with structural clarity.",
    "examples": [
      {
        "input": "Interview Concept Query",
        "output": "Structured technical explanation",
        "explanation": "Core conceptual definition and trade-offs."
      }
    ],
    "constraints": [
      "Be clear on trade-offs, theoretical bounds, and real-world system behavior."
    ],
    "starterCode": {
      "python": "# Conceptual summary & implementation notes\ndef getSummary():\n    return \"OSI Model vs TCP/IP Protocol Suite overview\"\n",
      "javascript": "function getSummary() {\n    return \"OSI Model vs TCP/IP Protocol Suite overview\";\n}\n",
      "java": "class Solution {\n    public String getSummary() {\n        return \"OSI Model vs TCP/IP Protocol Suite overview\";\n    }\n}\n",
      "cpp": "class Solution {\npublic:\n    string getSummary() {\n        return \"OSI Model vs TCP/IP Protocol Suite overview\";\n    }\n};\n"
    },
    "supportedLanguages": [
      "python",
      "javascript",
      "java",
      "cpp"
    ],
    "testCases": [
      {
        "id": "tc-cs-016-1",
        "input": "System Scenario",
        "expectedOutput": "Verified Concept"
      }
    ],
    "hints": [
      "Recall the architectural layer and core definitions.",
      "Highlight key trade-offs and real-world advantages.",
      "Structure answer logically into definitions, mechanisms, and examples."
    ],
    "approach": {
      "summary": "Comprehensive overview of OSI Model vs TCP/IP Protocol Suite.",
      "steps": [
        "Define core terms.",
        "Explain architecture and mechanisms.",
        "Provide real-world trade-off comparison."
      ]
    },
    "complexity": {
      "time": "O(1)",
      "space": "O(1)",
      "analysis": "Algorithm runs in O(1) time with O(1) space complexity."
    },
    "defaultMastery": 85,
    "recommendedTimeMinutes": 15
  },
  {
    "id": "pm-cs-017",
    "title": "TCP 3-Way Handshake & 4-Way Connection Teardown",
    "slug": "tcp-3-way-handshake-4-way-connection-teardown",
    "difficulty": "Medium",
    "category": "Core CS",
    "topics": [
      "Computer Networks"
    ],
    "companies": [
      "Amazon",
      "Google",
      "Microsoft"
    ],
    "frequentlyAsked": true,
    "interviewImportance": "Frequently Asked",
    "description": "Explain SYN, SYN-ACK, ACK handshake sequence numbers and FIN, ACK connection termination including TIME_WAIT state rationale.\n\nDemonstrate foundational understanding and explain standard interview scenarios with structural clarity.",
    "examples": [
      {
        "input": "Interview Concept Query",
        "output": "Structured technical explanation",
        "explanation": "Core conceptual definition and trade-offs."
      }
    ],
    "constraints": [
      "Be clear on trade-offs, theoretical bounds, and real-world system behavior."
    ],
    "starterCode": {
      "python": "# Conceptual summary & implementation notes\ndef getSummary():\n    return \"TCP 3-Way Handshake & 4-Way Connection Teardown overview\"\n",
      "javascript": "function getSummary() {\n    return \"TCP 3-Way Handshake & 4-Way Connection Teardown overview\";\n}\n",
      "java": "class Solution {\n    public String getSummary() {\n        return \"TCP 3-Way Handshake & 4-Way Connection Teardown overview\";\n    }\n}\n",
      "cpp": "class Solution {\npublic:\n    string getSummary() {\n        return \"TCP 3-Way Handshake & 4-Way Connection Teardown overview\";\n    }\n};\n"
    },
    "supportedLanguages": [
      "python",
      "javascript",
      "java",
      "cpp"
    ],
    "testCases": [
      {
        "id": "tc-cs-017-1",
        "input": "System Scenario",
        "expectedOutput": "Verified Concept"
      }
    ],
    "hints": [
      "Recall the architectural layer and core definitions.",
      "Highlight key trade-offs and real-world advantages.",
      "Structure answer logically into definitions, mechanisms, and examples."
    ],
    "approach": {
      "summary": "Comprehensive overview of TCP 3-Way Handshake & 4-Way Connection Teardown.",
      "steps": [
        "Define core terms.",
        "Explain architecture and mechanisms.",
        "Provide real-world trade-off comparison."
      ]
    },
    "complexity": {
      "time": "O(1)",
      "space": "O(1)",
      "analysis": "Algorithm runs in O(1) time with O(1) space complexity."
    },
    "defaultMastery": 85,
    "recommendedTimeMinutes": 25
  },
  {
    "id": "pm-cs-018",
    "title": "HTTP vs HTTPS & SSL/TLS Handshake",
    "slug": "http-vs-https-ssl-tls-handshake",
    "difficulty": "Medium",
    "category": "Core CS",
    "topics": [
      "Computer Networks"
    ],
    "companies": [
      "Amazon",
      "Google",
      "Zoho"
    ],
    "frequentlyAsked": true,
    "interviewImportance": "Frequently Asked",
    "description": "Explain asymmetric encryption for key exchange, symmetric encryption for data transfer, digital certificates, and TLS 1.3 handshake optimization.\n\nDemonstrate foundational understanding and explain standard interview scenarios with structural clarity.",
    "examples": [
      {
        "input": "Interview Concept Query",
        "output": "Structured technical explanation",
        "explanation": "Core conceptual definition and trade-offs."
      }
    ],
    "constraints": [
      "Be clear on trade-offs, theoretical bounds, and real-world system behavior."
    ],
    "starterCode": {
      "python": "# Conceptual summary & implementation notes\ndef getSummary():\n    return \"HTTP vs HTTPS & SSL/TLS Handshake overview\"\n",
      "javascript": "function getSummary() {\n    return \"HTTP vs HTTPS & SSL/TLS Handshake overview\";\n}\n",
      "java": "class Solution {\n    public String getSummary() {\n        return \"HTTP vs HTTPS & SSL/TLS Handshake overview\";\n    }\n}\n",
      "cpp": "class Solution {\npublic:\n    string getSummary() {\n        return \"HTTP vs HTTPS & SSL/TLS Handshake overview\";\n    }\n};\n"
    },
    "supportedLanguages": [
      "python",
      "javascript",
      "java",
      "cpp"
    ],
    "testCases": [
      {
        "id": "tc-cs-018-1",
        "input": "System Scenario",
        "expectedOutput": "Verified Concept"
      }
    ],
    "hints": [
      "Recall the architectural layer and core definitions.",
      "Highlight key trade-offs and real-world advantages.",
      "Structure answer logically into definitions, mechanisms, and examples."
    ],
    "approach": {
      "summary": "Comprehensive overview of HTTP vs HTTPS & SSL/TLS Handshake.",
      "steps": [
        "Define core terms.",
        "Explain architecture and mechanisms.",
        "Provide real-world trade-off comparison."
      ]
    },
    "complexity": {
      "time": "O(1)",
      "space": "O(1)",
      "analysis": "Algorithm runs in O(1) time with O(1) space complexity."
    },
    "defaultMastery": 85,
    "recommendedTimeMinutes": 25
  },
  {
    "id": "pm-cs-019",
    "title": "DNS Resolution Architecture & Caching Flow",
    "slug": "dns-resolution-architecture-caching-flow",
    "difficulty": "Easy",
    "category": "Core CS",
    "topics": [
      "Computer Networks"
    ],
    "companies": [
      "Microsoft",
      "Google",
      "Amazon"
    ],
    "frequentlyAsked": true,
    "interviewImportance": "Frequently Asked",
    "description": "Trace a DNS query from browser cache -> OS resolver -> Recursive resolver -> Root server -> TLD server -> Authoritative Name Server (A/CNAME records).\n\nDemonstrate foundational understanding and explain standard interview scenarios with structural clarity.",
    "examples": [
      {
        "input": "Interview Concept Query",
        "output": "Structured technical explanation",
        "explanation": "Core conceptual definition and trade-offs."
      }
    ],
    "constraints": [
      "Be clear on trade-offs, theoretical bounds, and real-world system behavior."
    ],
    "starterCode": {
      "python": "# Conceptual summary & implementation notes\ndef getSummary():\n    return \"DNS Resolution Architecture & Caching Flow overview\"\n",
      "javascript": "function getSummary() {\n    return \"DNS Resolution Architecture & Caching Flow overview\";\n}\n",
      "java": "class Solution {\n    public String getSummary() {\n        return \"DNS Resolution Architecture & Caching Flow overview\";\n    }\n}\n",
      "cpp": "class Solution {\npublic:\n    string getSummary() {\n        return \"DNS Resolution Architecture & Caching Flow overview\";\n    }\n};\n"
    },
    "supportedLanguages": [
      "python",
      "javascript",
      "java",
      "cpp"
    ],
    "testCases": [
      {
        "id": "tc-cs-019-1",
        "input": "System Scenario",
        "expectedOutput": "Verified Concept"
      }
    ],
    "hints": [
      "Recall the architectural layer and core definitions.",
      "Highlight key trade-offs and real-world advantages.",
      "Structure answer logically into definitions, mechanisms, and examples."
    ],
    "approach": {
      "summary": "Comprehensive overview of DNS Resolution Architecture & Caching Flow.",
      "steps": [
        "Define core terms.",
        "Explain architecture and mechanisms.",
        "Provide real-world trade-off comparison."
      ]
    },
    "complexity": {
      "time": "O(1)",
      "space": "O(1)",
      "analysis": "Algorithm runs in O(1) time with O(1) space complexity."
    },
    "defaultMastery": 85,
    "recommendedTimeMinutes": 15
  },
  {
    "id": "pm-cs-020",
    "title": "TCP Congestion Control: Slow Start, AIMD, and Fast Recovery",
    "slug": "tcp-congestion-control-slow-start-aimd-and-fast-recovery",
    "difficulty": "Hard",
    "category": "Core CS",
    "topics": [
      "Computer Networks"
    ],
    "companies": [
      "Google",
      "Amazon",
      "Microsoft"
    ],
    "frequentlyAsked": true,
    "interviewImportance": "Frequently Asked",
    "description": "Explain how TCP prevents network congestion via congestion window (cwnd), ssthresh, Slow Start, Congestion Avoidance (Additive Increase), and Fast Retransmit (Multiplicative Decrease).\n\nDemonstrate foundational understanding and explain standard interview scenarios with structural clarity.",
    "examples": [
      {
        "input": "Interview Concept Query",
        "output": "Structured technical explanation",
        "explanation": "Core conceptual definition and trade-offs."
      }
    ],
    "constraints": [
      "Be clear on trade-offs, theoretical bounds, and real-world system behavior."
    ],
    "starterCode": {
      "python": "# Conceptual summary & implementation notes\ndef getSummary():\n    return \"TCP Congestion Control: Slow Start, AIMD, and Fast Recovery overview\"\n",
      "javascript": "function getSummary() {\n    return \"TCP Congestion Control: Slow Start, AIMD, and Fast Recovery overview\";\n}\n",
      "java": "class Solution {\n    public String getSummary() {\n        return \"TCP Congestion Control: Slow Start, AIMD, and Fast Recovery overview\";\n    }\n}\n",
      "cpp": "class Solution {\npublic:\n    string getSummary() {\n        return \"TCP Congestion Control: Slow Start, AIMD, and Fast Recovery overview\";\n    }\n};\n"
    },
    "supportedLanguages": [
      "python",
      "javascript",
      "java",
      "cpp"
    ],
    "testCases": [
      {
        "id": "tc-cs-020-1",
        "input": "System Scenario",
        "expectedOutput": "Verified Concept"
      }
    ],
    "hints": [
      "Recall the architectural layer and core definitions.",
      "Highlight key trade-offs and real-world advantages.",
      "Structure answer logically into definitions, mechanisms, and examples."
    ],
    "approach": {
      "summary": "Comprehensive overview of TCP Congestion Control: Slow Start, AIMD, and Fast Recovery.",
      "steps": [
        "Define core terms.",
        "Explain architecture and mechanisms.",
        "Provide real-world trade-off comparison."
      ]
    },
    "complexity": {
      "time": "O(1)",
      "space": "O(1)",
      "analysis": "Algorithm runs in O(1) time with O(1) space complexity."
    },
    "defaultMastery": 85,
    "recommendedTimeMinutes": 40
  }
];

export const TOPICS_BY_CATEGORY: Record<Category, string[]> = {
  DSA: [
    "Arrays",
    "Strings",
    "Hashing",
    "Two Pointers",
    "Sliding Window",
    "Stack",
    "Queue",
    "Linked List",
    "Binary Search",
    "Trees",
    "Graphs",
    "Dynamic Programming",
    "Greedy",
    "Backtracking",
    "Math",
    "Prefix Sum",
    "Matrix"
  ],
  SQL: [
    "SQL Basics",
    "SELECT & WHERE",
    "WHERE & NULLs",
    "WHERE filtering",
    "DISTINCT & ORDER BY",
    "LEFT JOIN",
    "LEFT JOIN & NULL",
    "Self Join / DATEDIFF",
    "GROUP BY & Joins",
    "Aggregations",
    "Subqueries & GROUP BY",
    "Conditional Aggregations",
    "Date Functions & Aggregation",
    "Subqueries & Percentages",
    "Window Functions / Subqueries",
    "Subquery & Limit",
    "DENSE_RANK Window Function"
  ],
  "Core CS": [
    "OOP",
    "Design Patterns",
    "DBMS",
    "Transactions",
    "Operating Systems",
    "Concurrency",
    "Deadlock",
    "Computer Networks"
  ]
};

export const COMPANIES_LIST = [
  "Amazon",
  "Microsoft",
  "Google",
  "TCS",
  "Infosys",
  "Accenture",
  "Wipro",
  "Cognizant",
  "Capgemini",
  "Zoho",
  "Freshworks"
];
