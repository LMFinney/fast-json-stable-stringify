import { stringify } from './stringify';

describe('stringify', () => {
    describe('basic string output', () => {
        // from https://github.com/epoberezkin/fast-json-stable-stringify/blob/master/test/str.js
        it('should show a simple object', () => {
            // Arrange
            const obj = { c: 6, b: [4, 5], a: 3, z: null };

            // Act
            const result = stringify(obj);

            // Assert
            expect(result).toEqual('{"a":3,"b":[4,5],"c":6,"z":null}');
        });

        it('should show an object with undefined', () => {
            // Arrange
            const obj = { a: 3, z: undefined };

            // Act
            const result = stringify(obj);

            // Assert
            expect(result).toEqual('{"a":3}');
        });

        it('should show an object with null', () => {
            // Arrange
            const obj = { a: 3, z: null };

            // Act
            const result = stringify(obj);

            // Assert
            expect(result).toEqual('{"a":3,"z":null}');
        });

        it('should show an object with NaN and Infinity', () => {
            // Arrange
            const obj = { a: 3, b: NaN, c: Infinity };

            // Act
            const result = stringify(obj);

            // Assert
            expect(result).toEqual('{"a":3,"b":null,"c":null}');
        });

        it('should show an array with undefined', () => {
            // Arrange
            const obj = [4, undefined, 6];

            // Act
            const result = stringify(obj);

            // Assert
            expect(result).toEqual('[4,null,6]');
        });

        it('should show an object with empty string', () => {
            // Arrange
            const obj = { a: 3, z: '' };

            // Act
            const result = stringify(obj);

            // Assert
            expect(result).toEqual('{"a":3,"z":""}');
        });

        it('should show an object with a zero', () => {
            // Arrange
            const obj = { a: 3, z: 0 };

            // Act
            const result = stringify(obj);

            // Assert
            expect(result).toEqual('{"a":3,"z":0}');
        });

        it('should show an array with empty string', () => {
            // Arrange
            const obj = [4, '', 6];

            // Act
            const result = stringify(obj);

            // Assert
            expect(result).toEqual('[4,"",6]');
        });

        it('should handle undefined', () => {
            // Arrange
            const obj = undefined;

            // Act
            const result = stringify(obj);

            // Assert
            expect(result).toBeUndefined();
        });

        it('should handle null', () => {
            // Arrange
            const obj = null;

            // Act
            const result = stringify(obj);

            // Assert
            expect(result).toEqual('null');
        });
    });

    describe('toJson inputs', () => {
        // from https://github.com/epoberezkin/fast-json-stable-stringify/blob/master/test/to-json.js
        it('should show the result from a function', () => {
            // Arrange
            const obj = {
                one: 1,
                two: 2,
                toJSON: () => ({ one: 1 }),
            };

            // Act
            const result = stringify(obj);

            // Assert
            expect(result).toEqual('{"one":1}');
        });

        it('should show a string from a function', () => {
            // Arrange
            const obj = {
                one: 1,
                two: 2,
                toJSON: () => 'one',
            };

            // Act
            const result = stringify(obj);

            // Assert
            expect(result).toEqual('"one"');
        });

        it('should show an array from a function', () => {
            // Arrange
            const obj = {
                one: 1,
                two: 2,
                toJSON: () => ['one'],
            };

            // Act
            const result = stringify(obj);

            // Assert
            expect(result).toEqual('["one"]');
        });
    });

    describe('nested', () => {
        // from https://github.com/epoberezkin/fast-json-stable-stringify/blob/master/test/nested.js
        it('should handle a basic nested', () => {
            // Arrange
            const obj = { c: 8, a: 3, b: [{ y: 5, z: 6, x: 4 }, 7] };

            // Act
            const result = stringify(obj);

            // Assert
            expect(result).toEqual('{"a":3,"b":[{"x":4,"y":5,"z":6},7],"c":8}');
        });

        it('should handle cyclic (default)', () => {
            // Arrange
            const one: any = { a: 1 };
            const two = { a: 2, one: one };
            one.two = two;

            // Act
            try {
                stringify(one);
                fail('should not get here');
            } catch (e) {
                // Assert
                expect(e.toString()).toEqual(
                    'TypeError: Converting circular structure to JSON',
                );
            }
        });

        it('should handle cyclic (specifically allowed)', () => {
            // Arrange
            const one: any = { a: 1 };
            const two = { a: 2, one: one };
            one.two = two;

            // Act
            const result = stringify(one, { cycles: true });

            // Assert
            expect(result).toEqual('{"a":1,"two":{"a":2,"one":"__cycle__"}}');
        });

        it('should handle repeated non-cyclic value', () => {
            // Arrange
            const one = { x: 1 };
            const two = { a: one, b: one };

            // Act
            const result = stringify(two);

            // Assert
            expect(result).toEqual('{"a":{"x":1},"b":{"x":1}}');
        });

        it('acyclic but with reused obj-property pointers', () => {
            // Arrange
            const x = { a: 1 };
            const y = { b: x, c: x };

            // Act
            const result = stringify(y);

            // Assert
            expect(result).toEqual('{"b":{"a":1},"c":{"a":1}}');
        });
    });

    describe('with a comparator', () => {
        // from https://github.com/epoberezkin/fast-json-stable-stringify/blob/master/test/cmp.js
        it('should handle a custom comparison function', () => {
            // Arrange
            const obj = { c: 8, a: 3, b: [{ y: 5, z: 6, x: 4 }, 7] };

            // Act
            const result = stringify(obj, (a, b) => (a.key < b.key ? 1 : -1));

            // Assert
            expect(result).toEqual('{"c":8,"b":[{"z":6,"y":5,"x":4},7],"a":3}');
        });
    });
});
