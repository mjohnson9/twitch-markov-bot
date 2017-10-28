import {} from "jest";
import * as tokenize from "tokenize";

describe("tokenize", () => {
    describe("sanitize", () => {
        describe("should strip special control characters", () => {
            const TEST_CASES = [
                {
                    phrase: tokenize.TOKEN_LIST_BEGIN,
                    expected: [],
                },
                {
                    phrase: tokenize.TOKEN_LIST_END,
                    expected: [],
                },
                {
                    phrase: `word1 ${tokenize.TOKEN_LIST_BEGIN} word2 ${tokenize.TOKEN_LIST_END} word3`,
                    expected: [
                        new tokenize.Token(tokenize.TOKEN_LIST_BEGIN, "word1"),
                        new tokenize.Token("word1", "word2"),
                        new tokenize.Token("word2", "word3"),
                        new tokenize.Token("word3", tokenize.TOKEN_LIST_END),
                    ],
                },
            ];

            TEST_CASES.forEach((testCase) => {
                it(`"${testCase.phrase}"`, () => {
                    const tokenized = tokenize.tokenize(testCase.phrase);
                    expect(tokenized).toEqual(testCase.expected);
                });
            });
        });

        describe("should strip cheers", () => {
            const TEST_CASES = [
                {
                    phrase: "cheer1",
                    expected: [],
                },
                {
                    phrase: "word1 cheer1 word2",
                    expected: [
                        new tokenize.Token(tokenize.TOKEN_LIST_BEGIN, "word1"),
                        new tokenize.Token("word1", "word2"),
                        new tokenize.Token("word2", tokenize.TOKEN_LIST_END),
                    ],
                },
                {
                    phrase: "word1 cheer1 word2 cheer100 word3",
                    expected: [
                        new tokenize.Token(tokenize.TOKEN_LIST_BEGIN, "word1"),
                        new tokenize.Token("word1", "word2"),
                        new tokenize.Token("word2", "word3"),
                        new tokenize.Token("word3", tokenize.TOKEN_LIST_END),
                    ],
                },
            ];

            TEST_CASES.forEach((testCase) => {
                it(`"${testCase.phrase}"`, () => {
                    const tokenized = tokenize.tokenize(testCase.phrase);
                    expect(tokenized).toEqual(testCase.expected);
                });
            });
        });
    });

    describe("simple tokenization", () => {
        const TEST_CASES = [
            {
                phrase: "word1",
                expected: [
                    new tokenize.Token(tokenize.TOKEN_LIST_BEGIN, "word1"),
                    new tokenize.Token("word1", tokenize.TOKEN_LIST_END),
                ],
            },
            {
                phrase: "word1 word2",
                expected: [
                    new tokenize.Token(tokenize.TOKEN_LIST_BEGIN, "word1"),
                    new tokenize.Token("word1", "word2"),
                    new tokenize.Token("word2", tokenize.TOKEN_LIST_END),
                ],
            },
            {
                phrase: "word1 word2 word3",
                expected: [
                    new tokenize.Token(tokenize.TOKEN_LIST_BEGIN, "word1"),
                    new tokenize.Token("word1", "word2"),
                    new tokenize.Token("word2", "word3"),
                    new tokenize.Token("word3", tokenize.TOKEN_LIST_END),
                ],
            },
            {
                phrase: "word1  word2    word3",
                expected: [
                    new tokenize.Token(tokenize.TOKEN_LIST_BEGIN, "word1"),
                    new tokenize.Token("word1", "word2"),
                    new tokenize.Token("word2", "word3"),
                    new tokenize.Token("word3", tokenize.TOKEN_LIST_END),
                ],
            },
        ];

        TEST_CASES.forEach((testCase) => {
            it(`"${testCase.phrase}"`, () => {
                const tokenized = tokenize.tokenize(testCase.phrase);
                expect(tokenized).toEqual(testCase.expected);
            });
        });
    });
});
