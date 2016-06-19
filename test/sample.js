(function () {
    'use strict';

    describe('A suite', function () {
        it('contains spec with an expectation', function () {
            const value = true;
            expect(value).toBe(true);
        });

        it('contains spec with another expectation that fails', function () {
            const value = true;
            expect(value).toBe(false);
        });
    });
})();
