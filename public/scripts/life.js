(function () {
    function PixelMap(width, height) {
        var self = this;
        this.arr = new Uint8ClampedArray(width * height);

        this.getPixel = function (x, y) {
            // wrap
            if (x < 0) {
                x = width - 1;
            } else if (x >= width) {
                x = 0;
            } else if (y < 0) {
                y = height - 1;
            } else if (y >= height) {
                y = 0;
            }
            var pixel = self.arr[(y * width) + x];
            return typeof pixel === "number" ? pixel : null;
        }

        this.flipPixel = function (x, y) {
            var index = (y * width) + x;
            self.arr[index] = 1 - self.arr[index];
        }
    }

    function CanvasManager() {
        var self = this;
        var PIXEL_LENGTH = 40;
        var CANVAS_FILL_STYLE = "#004E61";
        var canvasEl, canvasCtx;
        var virtualWidth, virtualHeight;
        var pixelMap;

        self.init = function (_canvasEl_) {
            var canvasWidth, canvasHeight;

            canvasEl = _canvasEl_;
            canvasCtx = canvasEl.getContext('2d');
            canvasWidth = canvasEl.width;
            canvasHeight = canvasEl.height;
            virtualWidth = Math.ceil(canvasWidth / PIXEL_LENGTH);
            virtualHeight = Math.ceil(canvasHeight / PIXEL_LENGTH);
            pixelMap = new PixelMap(virtualWidth, virtualHeight);

            self.getPixel = pixelMap.getPixel;

            applyOffsets(canvasWidth, canvasHeight);
            canvasCtx.fillStyle = CANVAS_FILL_STYLE;
        }

        function applyOffsets(canvasWidth, canvasHeight) {
            var widthOffset = PIXEL_LENGTH * ((canvasWidth / PIXEL_LENGTH) - Math.floor(canvasWidth / PIXEL_LENGTH));
            var heightOffset = PIXEL_LENGTH * ((canvasHeight / PIXEL_LENGTH) - Math.floor(canvasHeight / PIXEL_LENGTH));

            canvasEl.width += widthOffset;
            canvasEl.height += heightOffset;
            canvasEl.style.transform = "translate(-" + widthOffset + "px, -" + heightOffset + "px)";
        }

        self.getVirtualWidth = function () {
            return virtualWidth;
        }

        self.getVirtualHeight = function () {
            return virtualHeight;
        }

        self.flipPixels = function (pixelsToFlip) {
            for (var i = 0; i < pixelsToFlip.length; i++) {
                var pixel = pixelsToFlip[i];
                var x = pixel[0];
                var y = pixel[1];
                pixelMap.flipPixel(x, y);
                self.updateCanvasAtPixel(x, y);
            }
        }

        self.updateCanvasAtPixel = function (x, y) {
            if (pixelMap.getPixel(x, y) === 1) {
                canvasCtx.fillRect(PIXEL_LENGTH * x, PIXEL_LENGTH * y, PIXEL_LENGTH, PIXEL_LENGTH);
            } else {
                canvasCtx.clearRect(PIXEL_LENGTH * x, PIXEL_LENGTH * y, PIXEL_LENGTH, PIXEL_LENGTH);
            }
        }

        self.reset = function () {
            canvasCtx.clearRect(0, 0, canvasEl.width, canvasEl.height);
        }
    }

    function Life(canvasManager) {
        var self = this;
        var canvasManager;
        var width;
        var height;
        var DELAY = 200;
        var RESET_DELAY = 2000;
        var START_ALIVE_PROBABILITY = .2;
        var pixelsToFlip;

        function countNeighbors(x, y) {
            return canvasManager.getPixel(x - 1, y - 1)
                + canvasManager.getPixel(x, y - 1)
                + canvasManager.getPixel(x + 1, y - 1)
                + canvasManager.getPixel(x - 1, y)
                + canvasManager.getPixel(x + 1, y)
                + canvasManager.getPixel(x - 1, y + 1)
                + canvasManager.getPixel(x, y + 1)
                + canvasManager.getPixel(x + 1, y + 1);
        }

        function makePixel(x, y) {
            var pixel = new Uint8ClampedArray(2);
            pixel[0] = x;
            pixel[1] = y;
            return pixel;
        }

        function update() {
            var pixelVal;
            var neighborCount;
            pixelsToFlip = [];

            for (var x = 0; x < width; x++) {
                for (var y = 0; y < height; y++) {
                    pixelVal = canvasManager.getPixel(x, y);
                    neighborCount = countNeighbors(x, y);

                    if ((pixelVal === 1 && (neighborCount < 2 || neighborCount > 3))
                        || (pixelVal === 0 && neighborCount === 3)) {
                        pixelsToFlip.push(makePixel(x, y));
                    }
                }
            }

            if (pixelsToFlip.length) {
                canvasManager.flipPixels(pixelsToFlip);
                updateAfterDelay();
            } else {
                window.setTimeout(resetBoard, RESET_DELAY);
            }
        }

        function updateAfterDelay() {
            window.setTimeout(function () {
                window.requestAnimationFrame(update);
            }, DELAY);
        }

        function resetBoard() {
            var pixelsToFlip = [];

            for (var x = 0; x < width; x++) {
                for (var y = 0; y < height; y++) {
                    if (Math.random() <= START_ALIVE_PROBABILITY) {
                        pixelsToFlip.push(makePixel(x,y));
                    }
                }
            }

            canvasManager.reset();
            canvasManager.flipPixels(pixelsToFlip);
            updateAfterDelay();
        }

        this.init = function (_canvasManager_) {
            canvasManager = _canvasManager_;
            width = canvasManager.getVirtualWidth();
            height = canvasManager.getVirtualHeight();

            resetBoard();
        }
    }

    function init() {
        var canvasManager = new CanvasManager();
        var life = new Life(canvasManager);

        document.addEventListener('DOMContentLoaded', function () {
            var canvasEl = document.getElementById('bg-canvas');
            canvasEl.width = window.innerWidth;
            canvasEl.height = window.innerHeight;
            canvasManager.init(canvasEl);
            life.init(canvasManager);
        });
    }

    init();
})();
