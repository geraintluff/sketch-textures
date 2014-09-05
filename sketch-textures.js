var sketchTexture = function (canvas, options, callback) {
	var width = canvas.width, height = canvas.height;
	var context = canvas.getContext('2d');
	window.context = context;

	var angle = options.angle*Math.PI/180;
	var diffX = Math.cos(angle) || 0.0001;
	var diffY = -Math.sin(angle) || 0.0001;

	var area = width*height;
	var scale = Math.sqrt(area);
	var lineLength = options.lineLength;
	var expectedLineLength = lineLength;
	if (!options.wrap) {
		expectedLineLength = Math.min(expectedLineLength, Math.abs(width/diffX), Math.abs(height/diffY));
	}
	
	var lineCount = area*options.density/options.opacity/options.lineWidth/expectedLineLength;
	
	for (var i = 0; i < lineCount; i++) {
		var midX = Math.random()*width;
		var midY = Math.random()*height;
		
		var forwardLength = lineLength*0.5, backwardLength = lineLength*0.5;
		if (!options.wrap) {
			forwardLength = Math.min(forwardLength, (width - midX)/diffX, (0 - midY)/diffY);
			backwardLength = Math.min(backwardLength, midX/diffX, (midY - height)/diffY);
		}
		if (options.taper) {
			forwardLength *= Math.pow(Math.random(), options.taper);
			backwardLength *= Math.pow(Math.random(), options.taper);
		}
		
		var startX = midX - diffX*backwardLength;
		var startY = midY - diffY*backwardLength;
		var endX = midX + diffX*forwardLength;
		var endY = midY + diffY*forwardLength;

		context.lineWidth = options.lineWidth;
		context.strokeStyle = options.stroke;
		context.globalAlpha = options.opacity;
		context.beginPath();
		
		if (options.wrap) {
			while (startX < 0 || endX < 0) {
				startX += width;
				endX += width;
			}
			while (startY < 0 || endY < 0) {
				startY += height;
				endY += height;
			}
			for (var offsetX = 0; endX + offsetX > 0 || startX + offsetX > 0; offsetX -= width) {
				for (var offsetY = 0; endY + offsetY > 0 || startY + offsetY > 0; offsetY -= height) {
					context.moveTo(startX + offsetX, startY + offsetY);
					context.lineTo(endX + offsetX, endY + offsetY);
				}
			}
		} else {
			context.moveTo(startX, startY);
			context.lineTo(endX, endY);
		}

		context.stroke();
	}
	
	setTimeout(function () {
		callback(null, canvas);
	}, 10);
};