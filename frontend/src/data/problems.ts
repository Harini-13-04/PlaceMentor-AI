export interface TestCase {
  input: string;
  expectedOutput: string;
  explanation?: string;
  isHidden?: boolean;
}

export interface Problem {
  id: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  category: "Algorithms & DSA" | "Database & SQL" | "Core CS";
  topic: string;
  companies: string[];
  status: "Not Started" | "Attempted" | "Solved";
  mastery: number; // percentage
  description: string;
  examples: {
    input: string;
    output: string;
    explanation?: string;
  }[];
  constraints: string[];
  hints: string[];
  optimalApproach: string[];
  timeComplexity: string;
  spaceComplexity: string;
  starterCodes: {
    python3: string;
    python: string;
    java: string;
    java17: string;
    sql: string;
    numpy: string;
    c: string;
    cpp: string;
    javascript: string;
  };
  testCases: TestCase[];
  hiddenTestCases: TestCase[];
}

function makeStarter(
  funcName: string,
  paramsPy: string,
  returnPy: string,
  javaRet: string,
  paramsJava: string,
  cppRet: string,
  paramsCpp: string,
  jsParams: string,
  sqlQuery: string = ""
) {
  return {
    python3: `class Solution:\n    def ${funcName}(self, ${paramsPy}) -> ${returnPy}:\n        # Write your code below\n        \n`,
    python: `def ${funcName}(${paramsPy}):\n    # Write your code below\n    \n`,
    java: `class Solution {\n    public ${javaRet} ${funcName}(${paramsJava}) {\n        // Write your code below\n        \n    }\n}\n`,
    java17: `class Solution {\n    public ${javaRet} ${funcName}(${paramsJava}) {\n        // Write your code below\n        \n    }\n}\n`,
    sql: sqlQuery,
    numpy: `import numpy as np\n\ndef ${funcName}(arr):\n    # Write your vectorized NumPy solution\n    \n`,
    c: `${cppRet === "vector<int>" ? "int*" : cppRet} ${funcName}(${paramsCpp}) {\n    // Write your code below\n    \n}\n`,
    cpp: `class Solution {\npublic:\n    ${cppRet} ${funcName}(${paramsCpp}) {\n        // Write your code below\n        \n    }\n};\n`,
    javascript: `/**\n * @param {${jsParams}}\n * @return {${returnPy}}\n */\nfunction ${funcName}(${jsParams.replace(/: [a-zA-Z<>\[\], ]+/g, "")}) {\n    // Write your code below\n    \n}\n`,
  };
}

export const PROBLEMS_DATASET: Problem[] = [
  // ----------------------------------------------------
  // ARRAYS & HASHING
  // ----------------------------------------------------
  {
    id: "two-sum",
    title: "Two Sum",
    difficulty: "Easy",
    category: "Algorithms & DSA",
    topic: "Arrays",
    companies: ["Amazon", "Google", "Microsoft", "TCS", "Infosys"],
    status: "Solved",
    mastery: 100,
    description: "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\nYou can return the answer in any order.",
    examples: [
      { input: "nums = [2,7,11,15], target = 9", output: "[0,1]", explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]." },
      { input: "nums = [3,2,4], target = 6", output: "[1,2]", explanation: "nums[1] + nums[2] == 6, return [1, 2]." },
      { input: "nums = [3,3], target = 6", output: "[0,1]" }
    ],
    constraints: [
      "2 <= nums.length <= 10^4",
      "-10^9 <= nums[i] <= 10^9",
      "-10^9 <= target <= 10^9",
      "Only one valid answer exists."
    ],
    hints: [
      "A brute force search checks all pairs in O(n²). Can you look up complements in O(1)?",
      "Use a Hash Map to store previously visited elements and their indices.",
      "As you iterate, check if `target - num` exists in the hash map. If so, return current index and stored index."
    ],
    optimalApproach: [
      "Initialize an empty Hash Map (dictionary) `seen = {}`.",
      "Iterate through `nums` with index `i` and value `num`.",
      "Calculate `complement = target - num`.",
      "If `complement` is in `seen`, return `[seen[complement], i]`.",
      "Otherwise, record `seen[num] = i`."
    ],
    timeComplexity: "O(n) — single pass through array with O(1) hash lookups.",
    spaceComplexity: "O(n) — auxiliary hash map storage.",
    starterCodes: makeStarter(
      "twoSum",
      "nums: list[int], target: int",
      "list[int]",
      "int[]",
      "int[] nums, int target",
      "vector<int>",
      "vector<int>& nums, int target",
      "nums: number[], target: number"
    ),
    testCases: [
      { input: "nums = [2,7,11,15], target = 9", expectedOutput: "[0,1]" },
      { input: "nums = [3,2,4], target = 6", expectedOutput: "[1,2]" },
      { input: "nums = [3,3], target = 6", expectedOutput: "[0,1]" }
    ],
    hiddenTestCases: [
      { input: "nums = [-1,-2,-3,-4,-5], target = -8", expectedOutput: "[2,4]", isHidden: true },
      { input: "nums = [0,4,3,0], target = 0", expectedOutput: "[0,3]", isHidden: true },
      { input: "nums = [1000000000,2000000000], target = 3000000000", expectedOutput: "[0,1]", isHidden: true },
      { input: "Large stress test (n=10000)", expectedOutput: "[4999,9999]", isHidden: true }
    ]
  },
  {
    id: "contains-duplicate",
    title: "Contains Duplicate",
    difficulty: "Easy",
    category: "Algorithms & DSA",
    topic: "Arrays",
    companies: ["Amazon", "Microsoft", "Accenture", "Wipro"],
    status: "Solved",
    mastery: 100,
    description: "Given an integer array `nums`, return `true` if any value appears at least twice in the array, and return `false` if every element is distinct.",
    examples: [
      { input: "nums = [1,2,3,1]", output: "true" },
      { input: "nums = [1,2,3,4]", output: "false" },
      { input: "nums = [1,1,1,3,3,4,3,2,4,2]", output: "true" }
    ],
    constraints: ["1 <= nums.length <= 10^5", "-10^9 <= nums[i] <= 10^9"],
    hints: [
      "Can we use a Hash Set to track seen numbers in O(1) time per item?",
      "If the set size after inserting all numbers is less than array length, duplicates exist."
    ],
    optimalApproach: [
      "Maintain a Hash Set of seen numbers.",
      "Iterate through the array. If the number is already in the set, return `true`.",
      "If iteration finishes without duplicates, return `false`."
    ],
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    starterCodes: makeStarter("containsDuplicate", "nums: list[int]", "bool", "boolean", "int[] nums", "bool", "vector<int>& nums", "nums: number[]"),
    testCases: [
      { input: "nums = [1,2,3,1]", expectedOutput: "true" },
      { input: "nums = [1,2,3,4]", expectedOutput: "false" }
    ],
    hiddenTestCases: [
      { input: "nums = [0]", expectedOutput: "false", isHidden: true },
      { input: "nums = [1000000000, -1000000000, 1000000000]", expectedOutput: "true", isHidden: true }
    ]
  },
  {
    id: "valid-anagram",
    title: "Valid Anagram",
    difficulty: "Easy",
    category: "Algorithms & DSA",
    topic: "Strings",
    companies: ["Google", "Amazon", "Cognizant", "TCS"],
    status: "Attempted",
    mastery: 60,
    description: "Given two strings `s` and `t`, return `true` if `t` is an anagram of `s`, and `false` otherwise.\n\nAn Anagram is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.",
    examples: [
      { input: 's = "anagram", t = "nagaram"', output: "true" },
      { input: 's = "rat", t = "car"', output: "false" }
    ],
    constraints: ["1 <= s.length, t.length <= 5 * 10^4", "s and t consist of lowercase English letters."],
    hints: [
      "If lengths differ, can they ever be anagrams?",
      "Count letter frequencies using a fixed 26-character array or hash map."
    ],
    optimalApproach: [
      "If `len(s) != len(t)`, return `false`.",
      "Count occurrences of each character in `s` (+1) and `t` (-1).",
      "If all character frequencies resolve to 0, return `true`."
    ],
    timeComplexity: "O(n)",
    spaceComplexity: "O(1) (fixed 26-character alphabet)",
    starterCodes: makeStarter("isAnagram", "s: str, t: str", "bool", "boolean", "String s, String t", "bool", "string s, string t", "s: string, t: string"),
    testCases: [
      { input: 's = "anagram", t = "nagaram"', expectedOutput: "true" },
      { input: 's = "rat", t = "car"', expectedOutput: "false" }
    ],
    hiddenTestCases: [
      { input: 's = "a", t = "a"', expectedOutput: "true", isHidden: true },
      { input: 's = "ab", t = "a"', expectedOutput: "false", isHidden: true }
    ]
  },
  {
    id: "group-anagrams",
    title: "Group Anagrams",
    difficulty: "Medium",
    category: "Algorithms & DSA",
    topic: "Strings",
    companies: ["Amazon", "Microsoft", "Google", "Uber"],
    status: "Not Started",
    mastery: 0,
    description: "Given an array of strings `strs`, group the anagrams together. You can return the answer in any order.",
    examples: [
      { input: 'strs = ["eat","tea","tan","ate","nat","bat"]', output: '[["bat"],["nat","tan"],["ate","eat","tea"]]' },
      { input: 'strs = [""]', output: '[[""]]' },
      { input: 'strs = ["a"]', output: '[["a"]]' }
    ],
    constraints: ["1 <= strs.length <= 10^4", "0 <= strs[i].length <= 100", "strs[i] consists of lowercase English letters."],
    hints: [
      "Two strings are anagrams if and only if their sorted character sequences are equal.",
      "Can we use the sorted string or character count tuple as a hash map key?"
    ],
    optimalApproach: [
      "Create a map from canonical key to list of matching strings.",
      "For each word, either sort its characters or build a 26-element frequency tuple.",
      "Append the word to `map[key]`.",
      "Return all values in the map."
    ],
    timeComplexity: "O(n * k log k) where k is max string length",
    spaceComplexity: "O(n * k)",
    starterCodes: makeStarter("groupAnagrams", "strs: list[str]", "list[list[str]]", "List<List<String>>", "String[] strs", "vector<vector<string>>", "vector<string>& strs", "strs: string[]"),
    testCases: [
      { input: 'strs = ["eat","tea","tan","ate","nat","bat"]', expectedOutput: '[["eat","tea","ate"],["tan","nat"],["bat"]]' }
    ],
    hiddenTestCases: [
      { input: 'strs = ["bdddddddddd", "bbbbbbbbbbc"]', expectedOutput: '[["bdddddddddd"],["bbbbbbbbbbc"]]', isHidden: true }
    ]
  },
  {
    id: "top-k-frequent-elements",
    title: "Top K Frequent Elements",
    difficulty: "Medium",
    category: "Algorithms & DSA",
    topic: "Hashing",
    companies: ["Amazon", "Facebook", "Microsoft"],
    status: "Not Started",
    mastery: 0,
    description: "Given an integer array `nums` and an integer `k`, return the `k` most frequent elements. You may return the answer in any order.",
    examples: [
      { input: "nums = [1,1,1,2,2,3], k = 2", output: "[1,2]" },
      { input: "nums = [1], k = 1", output: "[1]" }
    ],
    constraints: ["1 <= nums.length <= 10^5", "-10^4 <= nums[i] <= 10^4", "k is in the range [1, the number of unique elements in the array]."],
    hints: [
      "First count occurrences with a hash table.",
      "Can we use Bucket Sort where index represents frequency to achieve O(n) runtime?"
    ],
    optimalApproach: [
      "Count frequency of each number using a Hash Map.",
      "Create an array of buckets where `bucket[freq]` contains numbers with that frequency.",
      "Iterate backwards from `n` down to 1, collecting elements until `k` elements are gathered."
    ],
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    starterCodes: makeStarter("topKFrequent", "nums: list[int], k: int", "list[int]", "int[]", "int[] nums, int k", "vector<int>", "vector<int>& nums, int k", "nums: number[], k: number"),
    testCases: [
      { input: "nums = [1,1,1,2,2,3], k = 2", expectedOutput: "[1,2]" }
    ],
    hiddenTestCases: [
      { input: "nums = [4,1,-1,2,-1,2,3], k = 2", expectedOutput: "[-1,2]", isHidden: true }
    ]
  },
  {
    id: "product-of-array-except-self",
    title: "Product of Array Except Self",
    difficulty: "Medium",
    category: "Algorithms & DSA",
    topic: "Prefix Sum",
    companies: ["Amazon", "Microsoft", "Apple", "Google"],
    status: "Not Started",
    mastery: 0,
    description: "Given an integer array `nums`, return an array `answer` such that `answer[i]` is equal to the product of all the elements of `nums` except `nums[i]`.\n\nThe product of any prefix or suffix of `nums` is guaranteed to fit in a 32-bit integer.\n\nYou must write an algorithm that runs in O(n) time and without using the division operation.",
    examples: [
      { input: "nums = [1,2,3,4]", output: "[24,12,8,6]" },
      { input: "nums = [-1,1,0,-3,3]", output: "[0,0,9,0,0]" }
    ],
    constraints: ["2 <= nums.length <= 10^5", "-30 <= nums[i] <= 30"],
    hints: [
      "Think about prefix products to the left of i and suffix products to the right of i.",
      "Combine prefix and suffix passes directly into the output array to achieve O(1) extra space."
    ],
    optimalApproach: [
      "Initialize `res` array of size `n` with 1s.",
      "Pass 1: calculate left prefix products into `res`.",
      "Pass 2: maintain a running right suffix product variable and multiply into `res[i]` from right to left."
    ],
    timeComplexity: "O(n)",
    spaceComplexity: "O(1) extra space",
    starterCodes: makeStarter("productExceptSelf", "nums: list[int]", "list[int]", "int[]", "int[] nums", "vector<int>", "vector<int>& nums", "nums: number[]"),
    testCases: [
      { input: "nums = [1,2,3,4]", expectedOutput: "[24,12,8,6]" }
    ],
    hiddenTestCases: [
      { input: "nums = [0,0]", expectedOutput: "[0,0]", isHidden: true }
    ]
  },

  // ----------------------------------------------------
  // TWO POINTERS & SLIDING WINDOW
  // ----------------------------------------------------
  {
    id: "valid-palindrome",
    title: "Valid Palindrome",
    difficulty: "Easy",
    category: "Algorithms & DSA",
    topic: "Two Pointers",
    companies: ["Facebook", "Microsoft", "Amazon"],
    status: "Solved",
    mastery: 100,
    description: "A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.\n\nGiven a string `s`, return `true` if it is a palindrome, or `false` otherwise.",
    examples: [
      { input: 's = "A man, a plan, a canal: Panama"', output: "true" },
      { input: 's = "race a car"', output: "false" },
      { input: 's = " "', output: "true" }
    ],
    constraints: ["1 <= s.length <= 2 * 10^5", "s consists only of printable ASCII characters."],
    hints: ["Use two pointers starting at both ends, skipping non-alphanumerics."],
    optimalApproach: [
      "Initialize left pointer at 0 and right pointer at length - 1.",
      "Advance left while non-alphanumeric; retreat right while non-alphanumeric.",
      "Compare lowercase characters. If mismatched, return false. Return true once pointers cross."
    ],
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    starterCodes: makeStarter("isPalindrome", "s: str", "bool", "boolean", "String s", "bool", "string s", "s: string"),
    testCases: [
      { input: 's = "A man, a plan, a canal: Panama"', expectedOutput: "true" },
      { input: 's = "race a car"', expectedOutput: "false" }
    ],
    hiddenTestCases: [
      { input: 's = "0P"', expectedOutput: "false", isHidden: true }
    ]
  },
  {
    id: "3sum",
    title: "3Sum",
    difficulty: "Medium",
    category: "Algorithms & DSA",
    topic: "Two Pointers",
    companies: ["Amazon", "Facebook", "Microsoft", "Google"],
    status: "Attempted",
    mastery: 50,
    description: "Given an integer array nums, return all the triplets `[nums[i], nums[j], nums[k]]` such that `i != j`, `i != k`, and `j != k`, and `nums[i] + nums[j] + nums[k] == 0`.\n\nNotice that the solution set must not contain duplicate triplets.",
    examples: [
      { input: "nums = [-1,0,1,2,-1,-4]", output: "[[-1,-1,2],[-1,0,1]]" },
      { input: "nums = [0,1,1]", output: "[]" },
      { input: "nums = [0,0,0]", output: "[[0,0,0]]" }
    ],
    constraints: ["3 <= nums.length <= 3000", "-10^5 <= nums[i] <= 10^5"],
    hints: [
      "Sort the array first.",
      "Fix one element and use two pointers for the remaining pair.",
      "Skip duplicate elements carefully to avoid duplicate triplets."
    ],
    optimalApproach: [
      "Sort `nums`.",
      "Iterate `i` from 0 to n-3. If `nums[i] > 0`, break early.",
      "Use two pointers `l = i+1, r = n-1` to find pairs summing to `-nums[i]`."
    ],
    timeComplexity: "O(n²)",
    spaceComplexity: "O(1) extra space",
    starterCodes: makeStarter("threeSum", "nums: list[int]", "list[list[int]]", "List<List<Integer>>", "int[] nums", "vector<vector<int>>", "vector<int>& nums", "nums: number[]"),
    testCases: [
      { input: "nums = [-1,0,1,2,-1,-4]", expectedOutput: "[[-1,-1,2],[-1,0,1]]" }
    ],
    hiddenTestCases: [
      { input: "nums = [-2,0,1,1,2]", expectedOutput: "[[-2,0,2],[-2,1,1]]", isHidden: true }
    ]
  },
  {
    id: "container-with-most-water",
    title: "Container With Most Water",
    difficulty: "Medium",
    category: "Algorithms & DSA",
    topic: "Two Pointers",
    companies: ["Google", "Amazon", "Adobe"],
    status: "Not Started",
    mastery: 0,
    description: "You are given an integer array `height` of length `n`. Find two lines that together with the x-axis form a container, such that the container contains the most water.\n\nReturn the maximum amount of water a container can store.",
    examples: [
      { input: "height = [1,8,6,2,5,4,8,3,7]", output: "49" },
      { input: "height = [1,1]", output: "1" }
    ],
    constraints: ["n == height.length", "2 <= n <= 10^5", "0 <= height[i] <= 10^4"],
    hints: ["Start with maximum width and move the shorter line inward."],
    optimalApproach: [
      "Place two pointers at left=0 and right=n-1.",
      "Calculate area = min(height[l], height[r]) * (r - l).",
      "Move the pointer with smaller height inward."
    ],
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    starterCodes: makeStarter("maxArea", "height: list[int]", "int", "int", "int[] height", "int", "vector<int>& height", "height: number[]"),
    testCases: [
      { input: "height = [1,8,6,2,5,4,8,3,7]", expectedOutput: "49" }
    ],
    hiddenTestCases: [
      { input: "height = [4,3,2,1,4]", expectedOutput: "16", isHidden: true }
    ]
  },
  {
    id: "longest-substring-without-repeating-characters",
    title: "Longest Substring Without Repeating Characters",
    difficulty: "Medium",
    category: "Algorithms & DSA",
    topic: "Sliding Window",
    companies: ["Amazon", "Microsoft", "Google", "Bloomberg"],
    status: "Attempted",
    mastery: 50,
    description: "Given a string `s`, find the length of the longest substring without repeating characters.",
    examples: [
      { input: 's = "abcabcbb"', output: "3", explanation: "The answer is 'abc', with the length of 3." },
      { input: 's = "bbbbb"', output: "1" },
      { input: 's = "pwwkew"', output: "3" }
    ],
    constraints: ["0 <= s.length <= 5 * 10^4", "s consists of English letters, digits, symbols and spaces."],
    hints: ["Use a sliding window [l, r] with a hash map storing the last seen index of each character."],
    optimalApproach: [
      "Maintain a sliding window `left` and a map `last_seen` of char indices.",
      "When char `s[r]` was seen at index >= `left`, advance `left = last_seen[s[r]] + 1`.",
      "Update max length at each step."
    ],
    timeComplexity: "O(n)",
    spaceComplexity: "O(min(n, m)) where m is charset size",
    starterCodes: makeStarter("lengthOfLongestSubstring", "s: str", "int", "int", "String s", "int", "string s", "s: string"),
    testCases: [
      { input: 's = "abcabcbb"', expectedOutput: "3" },
      { input: 's = "bbbbb"', expectedOutput: "1" }
    ],
    hiddenTestCases: [
      { input: 's = "tmmzuxt"', expectedOutput: "5", isHidden: true }
    ]
  },

  // ----------------------------------------------------
  // STACK & LINKED LISTS
  // ----------------------------------------------------
  {
    id: "valid-parentheses",
    title: "Valid Parentheses",
    difficulty: "Easy",
    category: "Algorithms & DSA",
    topic: "Stack",
    companies: ["Amazon", "Microsoft", "Google", "Facebook"],
    status: "Solved",
    mastery: 100,
    description: "Given a string `s` containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
    examples: [
      { input: 's = "()"', output: "true" },
      { input: 's = "()[]{}"', output: "true" },
      { input: 's = "(]"', output: "false" }
    ],
    constraints: ["1 <= s.length <= 10^4", "s consists of parentheses only '()[]{}'."],
    hints: ["Push opening brackets to a stack; for closing brackets check if top matches."],
    optimalApproach: [
      "Use a stack. Push opening brackets.",
      "On closing bracket, pop stack and check if matches. If stack empty or mismatch, return false.",
      "At end return `len(stack) == 0`."
    ],
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    starterCodes: makeStarter("isValid", "s: str", "bool", "boolean", "String s", "bool", "string s", "s: string"),
    testCases: [
      { input: 's = "()"', expectedOutput: "true" },
      { input: 's = "()[]{}"', expectedOutput: "true" }
    ],
    hiddenTestCases: [
      { input: 's = "([)]"', expectedOutput: "false", isHidden: true }
    ]
  },
  {
    id: "reverse-linked-list",
    title: "Reverse Linked List",
    difficulty: "Easy",
    category: "Algorithms & DSA",
    topic: "Linked List",
    companies: ["Amazon", "Microsoft", "Google", "Apple"],
    status: "Solved",
    mastery: 100,
    description: "Given the `head` of a singly linked list, reverse the list, and return the reversed list.",
    examples: [
      { input: "head = [1,2,3,4,5]", output: "[5,4,3,2,1]" },
      { input: "head = [1,2]", output: "[2,1]" },
      { input: "head = []", output: "[]" }
    ],
    constraints: ["0 <= number of nodes <= 5000", "-5000 <= Node.val <= 5000"],
    hints: ["Iteratively redirect `curr.next` to `prev`."],
    optimalApproach: [
      "Initialize `prev = None, curr = head`.",
      "While `curr`: store `nxt = curr.next`, set `curr.next = prev`, advance `prev = curr, curr = nxt`.",
      "Return `prev`."
    ],
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    starterCodes: makeStarter("reverseList", "head: Optional[ListNode]", "Optional[ListNode]", "ListNode", "ListNode head", "ListNode*", "ListNode* head", "head"),
    testCases: [
      { input: "head = [1,2,3,4,5]", expectedOutput: "[5,4,3,2,1]" }
    ],
    hiddenTestCases: [
      { input: "head = [1]", expectedOutput: "[1]", isHidden: true }
    ]
  },

  // ----------------------------------------------------
  // TREES & BINARY SEARCH
  // ----------------------------------------------------
  {
    id: "invert-binary-tree",
    title: "Invert Binary Tree",
    difficulty: "Easy",
    category: "Algorithms & DSA",
    topic: "Trees",
    companies: ["Google", "Amazon", "Microsoft"],
    status: "Solved",
    mastery: 100,
    description: "Given the `root` of a binary tree, invert the tree, and return its root.",
    examples: [
      { input: "root = [4,2,7,1,3,6,9]", output: "[4,7,2,9,6,3,1]" },
      { input: "root = [2,1,3]", output: "[2,3,1]" },
      { input: "root = []", output: "[]" }
    ],
    constraints: ["0 <= number of nodes <= 100", "-100 <= Node.val <= 100"],
    hints: ["Recursively swap the left and right children for every node."],
    optimalApproach: [
      "Base case: if `not root`: return None.",
      "Swap `root.left` and `root.right`.",
      "Recursively call invert on both children, then return `root`."
    ],
    timeComplexity: "O(n)",
    spaceComplexity: "O(h) call stack height",
    starterCodes: makeStarter("invertTree", "root: Optional[TreeNode]", "Optional[TreeNode]", "TreeNode", "TreeNode root", "TreeNode*", "TreeNode* root", "root"),
    testCases: [
      { input: "root = [4,2,7,1,3,6,9]", expectedOutput: "[4,7,2,9,6,3,1]" }
    ],
    hiddenTestCases: [
      { input: "root = [1,2]", expectedOutput: "[1,null,2]", isHidden: true }
    ]
  },
  {
    id: "binary-search",
    title: "Binary Search",
    difficulty: "Easy",
    category: "Algorithms & DSA",
    topic: "Binary Search",
    companies: ["Microsoft", "Google", "Apple"],
    status: "Solved",
    mastery: 100,
    description: "Given an array of integers `nums` sorted in ascending order, and an integer `target`, write a function to search `target` in `nums`. If `target` exists, return its index. Otherwise, return -1.",
    examples: [
      { input: "nums = [-1,0,3,5,9,12], target = 9", output: "4" },
      { input: "nums = [-1,0,3,5,9,12], target = 2", output: "-1" }
    ],
    constraints: ["1 <= nums.length <= 10^4", "-10^4 < nums[i], target < 10^4", "All integers in nums are unique."],
    hints: ["Compare target with middle element and halve search interval."],
    optimalApproach: ["Initialize l=0, r=len-1. Calculate mid = l + (r-l)//2. Move l or r based on comparison."],
    timeComplexity: "O(log n)",
    spaceComplexity: "O(1)",
    starterCodes: makeStarter("search", "nums: list[int], target: int", "int", "int", "int[] nums, int target", "int", "vector<int>& nums, int target", "nums: number[], target: number"),
    testCases: [
      { input: "nums = [-1,0,3,5,9,12], target = 9", expectedOutput: "4" }
    ],
    hiddenTestCases: [
      { input: "nums = [5], target = 5", expectedOutput: "0", isHidden: true },
      { input: "nums = [2,5], target = 5", expectedOutput: "1", isHidden: true }
    ]
  },

  // ----------------------------------------------------
  // DYNAMIC PROGRAMMING
  // ----------------------------------------------------
  {
    id: "climbing-stairs",
    title: "Climbing Stairs",
    difficulty: "Easy",
    category: "Algorithms & DSA",
    topic: "Dynamic Programming",
    companies: ["Amazon", "Google", "Apple", "Adobe"],
    status: "Solved",
    mastery: 100,
    description: "You are climbing a staircase. It takes `n` steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?",
    examples: [
      { input: "n = 2", output: "2" },
      { input: "n = 3", output: "3" }
    ],
    constraints: ["1 <= n <= 45"],
    hints: ["To reach step n, you came from step n-1 or n-2. Ways(n) = Ways(n-1) + Ways(n-2)."],
    optimalApproach: ["Fibonacci recurrence with two variables `a=1, b=1`. Loop `n-1` times."],
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    starterCodes: makeStarter("climbStairs", "n: int", "int", "int", "int n", "int", "int n", "n: number"),
    testCases: [
      { input: "n = 2", expectedOutput: "2" },
      { input: "n = 3", expectedOutput: "3" }
    ],
    hiddenTestCases: [
      { input: "n = 45", expectedOutput: "1836311903", isHidden: true }
    ]
  },
  {
    id: "coin-change",
    title: "Coin Change",
    difficulty: "Medium",
    category: "Algorithms & DSA",
    topic: "Dynamic Programming",
    companies: ["Amazon", "Microsoft", "Google", "Uber"],
    status: "Attempted",
    mastery: 40,
    description: "You are given an integer array `coins` representing coins of different denominations and an integer `amount` representing a total amount of money. Return the fewest number of coins that you need to make up that amount.",
    examples: [
      { input: "coins = [1,2,5], amount = 11", output: "3", explanation: "11 = 5 + 5 + 1" },
      { input: "coins = [2], amount = 3", output: "-1" },
      { input: "coins = [1], amount = 0", output: "0" }
    ],
    constraints: ["1 <= coins.length <= 12", "1 <= coins[i] <= 2^31 - 1", "0 <= amount <= 10^4"],
    hints: ["Build bottom-up DP table `dp[i]` = min coins for amount `i`."],
    optimalApproach: [
      "Initialize `dp` array of size `amount + 1` filled with `infinity`, with `dp[0] = 0`.",
      "For each amount `i` from 1 to `amount`, and each `coin`: if `coin <= i`, `dp[i] = min(dp[i], dp[i - coin] + 1)`.",
      "Return `dp[amount]` if not infinity else -1."
    ],
    timeComplexity: "O(amount * len(coins))",
    spaceComplexity: "O(amount)",
    starterCodes: makeStarter("coinChange", "coins: list[int], amount: int", "int", "int", "int[] coins, int amount", "int", "vector<int>& coins, int amount", "coins: number[], amount: number"),
    testCases: [
      { input: "coins = [1,2,5], amount = 11", expectedOutput: "3" }
    ],
    hiddenTestCases: [
      { input: "coins = [186,419,83,408], amount = 6249", expectedOutput: "20", isHidden: true }
    ]
  },

  // ----------------------------------------------------
  // DATABASE & SQL
  // ----------------------------------------------------
  {
    id: "combine-two-tables",
    title: "Combine Two Tables",
    difficulty: "Easy",
    category: "Database & SQL",
    topic: "SQL",
    companies: ["Amazon", "Microsoft", "Oracle"],
    status: "Solved",
    mastery: 100,
    description: "Write a solution to report the first name, last name, city, and state of each person in the `Person` table. If the address of a `personId` is not present in the `Address` table, report `null` instead.",
    examples: [
      {
        input: "Person = [[1, 'Wang', 'Allen'], [2, 'Alice', 'Bob']], Address = [[1, 2, 'New York City', 'New York']]",
        output: "[['Allen', 'Wang', null, null], ['Bob', 'Alice', 'New York City', 'New York']]"
      }
    ],
    constraints: ["personId is the primary key for Person table."],
    hints: ["Use a LEFT JOIN from Person to Address on personId."],
    optimalApproach: ["SELECT p.firstName, p.lastName, a.city, a.state FROM Person p LEFT JOIN Address a ON p.personId = a.personId;"],
    timeComplexity: "O(n + m)",
    spaceComplexity: "O(n)",
    starterCodes: makeStarter("combineTwoTables", "", "", "", "", "", "", "", ""),
    testCases: [
      { input: "Execute Table Query", expectedOutput: "Joined Table View" }
    ],
    hiddenTestCases: [
      { input: "Hidden test: Empty Address table", expectedOutput: "All rows with null city/state", isHidden: true }
    ]
  },
  {
    id: "second-highest-salary",
    title: "Second Highest Salary",
    difficulty: "Medium",
    category: "Database & SQL",
    topic: "SQL",
    companies: ["Amazon", "Google", "LinkedIn", "TCS"],
    status: "Solved",
    mastery: 100,
    description: "Write a solution to find the second highest salary from the `Employee` table. If there is no second highest salary, return `null`.",
    examples: [
      { input: "Employee = [[1, 100], [2, 200], [3, 300]]", output: "200" }
    ],
    constraints: ["id is the primary key column for this table."],
    hints: ["Use `MAX(salary) WHERE salary < (MAX(salary))`."],
    optimalApproach: ["SELECT MAX(salary) AS SecondHighestSalary FROM Employee WHERE salary < (SELECT MAX(salary) FROM Employee);"],
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    starterCodes: makeStarter("secondHighestSalary", "", "", "", "", "", "", "", ""),
    testCases: [
      { input: "Execute Salary Query", expectedOutput: "200" }
    ],
    hiddenTestCases: [
      { input: "Hidden test: Single row table", expectedOutput: "null", isHidden: true }
    ]
  },

  // ----------------------------------------------------
  // CORE COMPUTER SCIENCE
  // ----------------------------------------------------
  {
    id: "lru-cache-design",
    title: "LRU Cache Design",
    difficulty: "Medium",
    category: "Core CS",
    topic: "OOP",
    companies: ["Amazon", "Microsoft", "Google", "Bloomberg"],
    status: "Attempted",
    mastery: 50,
    description: "Design a data structure that follows the constraints of a Least Recently Used (LRU) cache with O(1) get and put operations.",
    examples: [
      { input: '["LRUCache", "put", "put", "get", "put", "get", "put", "get", "get", "get"]\n[[2], [1, 1], [2, 2], [1], [3, 3], [2], [4, 4], [1], [3], [4]]', output: "[null, null, null, 1, null, -1, null, -1, 3, 4]" }
    ],
    constraints: ["1 <= capacity <= 3000", "0 <= key <= 10^4", "At most 2 * 10^5 calls to get and put."],
    hints: ["Combine a Hash Map (for O(1) key lookup) with a Doubly Linked List (for O(1) node removal and insertion)."],
    optimalApproach: [
      "Maintain a Hash Map `key -> Node` and a Doubly Linked List with dummy head & tail.",
      "On `get(key)`: if present, move node to head and return value.",
      "On `put(key, val)`: if present update and move to head; if new and over capacity, evict tail node."
    ],
    timeComplexity: "O(1) for both get and put",
    spaceComplexity: "O(capacity)",
    starterCodes: makeStarter("LRUCache", "capacity: int", "None", "void", "int capacity", "void", "int capacity", "capacity"),
    testCases: [
      { input: "LRUCache(2), put(1,1), put(2,2), get(1)", expectedOutput: "1" }
    ],
    hiddenTestCases: [
      { input: "Hidden capacity edge cases", expectedOutput: "Passed", isHidden: true }
    ]
  }
];
