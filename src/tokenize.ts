export const TOKEN_LIST_BEGIN = "\x02";
export const TOKEN_LIST_END = "\x03";

export class Token {
    public fromWord: string;
    public toWord: string;

    constructor(fromWord: string, toWord: string) {
        this.fromWord = fromWord;
        this.toWord = toWord;
    }
}

const FORBIDDEN_REGEX = new RegExp(`(?:${TOKEN_LIST_BEGIN}|${TOKEN_LIST_END}|\\bcheer\\d+\\b)`, "g");
function tokenize(text: string): Token[] {
    text = text.replace(FORBIDDEN_REGEX, "");
    const textSplit = text.split(" ");

    const tokens: Token[] = [];
    let lastWord = TOKEN_LIST_BEGIN;
    for(const word of textSplit) {
        if(word === "") { continue; } // ignore empty strings

        const thisToken = new Token(lastWord, word);
        tokens.push(thisToken);

        lastWord = word;
    }

    if(tokens.length === 0) {
        // we somehow made an empty token list; don't bother going any further
        return tokens;
    }

    tokens.push(new Token(lastWord, TOKEN_LIST_END));

    return tokens;
}

export {tokenize};
