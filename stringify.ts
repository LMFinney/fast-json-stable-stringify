type CompareDescriptor = {
    key: string;
    value: any;
};
type Comparator = (a: CompareDescriptor, b: CompareDescriptor) => number;

interface Options {
    cycles?: boolean;
    cmp?: Comparator;
}

export function stringify(data: any, options: Options | Comparator = {}) {
    let opts: Options;
    if (typeof options === 'function') {
        opts = { cmp: options };
    } else {
        opts = options;
    }
    const cycles = typeof opts.cycles === 'boolean' ? opts.cycles : false;

    const cmp =
        opts.cmp &&
        ((node: CompareDescriptor) => (a: string, b: string) =>
            opts.cmp!({ key: a, value: node[a] }, { key: b, value: node[b] }));

    const seen: Array<any> = [];
    return (function recurse(node: any) {
        if (node && node.toJSON && typeof node.toJSON === 'function') {
            node = node.toJSON();
        }

        if (node === undefined) {
            return;
        }
        if (typeof node == 'number') {
            return isFinite(node) ? '' + node : 'null';
        }
        if (typeof node !== 'object') {
            return JSON.stringify(node);
        }

        if (Array.isArray(node)) {
            let out = '[';
            for (let i = 0; i < node.length; i++) {
                if (i) {
                    out += ',';
                }
                out += recurse(node[i]) || 'null';
            }
            return out + ']';
        }

        if (node === null) {
            return 'null';
        }

        if (seen.indexOf(node) !== -1) {
            if (cycles) {
                return JSON.stringify('__cycle__');
            }
            throw new TypeError('Converting circular structure to JSON');
        }

        const seenIndex = seen.push(node) - 1;
        const keys = Object.keys(node).sort(cmp && cmp(node));
        let out = '';
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            const value = recurse(node[key]);

            if (!value) {
                continue;
            }
            if (out) {
                out += ',';
            }
            out += JSON.stringify(key) + ':' + value;
        }
        seen.splice(seenIndex, 1);
        return '{' + out + '}';
    })(data);
}
