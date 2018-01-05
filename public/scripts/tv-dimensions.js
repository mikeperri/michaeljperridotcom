(function () {
    function getTvDimensions(diagonal) {
        const width = Math.sqrt(Math.pow(diagonal, 2) * (256 / 337));
        const height = 9 * width / 16

        return {
            width,
            height,
        };
    }

    function init() {
        document.addEventListener('DOMContentLoaded', function () {
            const diagonalInputEl = document.getElementById('diagonal');
            const widthEl = document.getElementById('width');
            const heightEl = document.getElementById('height');

            diagonalInputEl.addEventListener('input', e => {
                const diagonalStr = e.target.value;

                if (diagonalStr.length) {
                    const diagonal = parseInt(diagonalStr);
                    const { width, height } = getTvDimensions(diagonal);

                    widthEl.textContent = width;
                    heightEl.textContent = height;
                } else {
                    widthEl.textContent = '';
                    heightEl.textContent = '';
                }
            });
        });
    }

    init();
})();
