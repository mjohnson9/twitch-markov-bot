import {} from "jest";
import * as tokenize from "tokenize";

describe("Tokenize", () => {
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
        it("must correctly tokenize \"" + testCase.phrase + "\"", () => {
            const tokenized = tokenize.default(testCase.phrase);
            expect(tokenized).toEqual(testCase.expected);
        });
    });
});
