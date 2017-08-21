'use strict'

/*
	screenshot base on canvas.
	@author  NARUTOne
	@date: 2017/08/21
	@descript: 基于 canvas 实现的一个截图小 demo
*/

/*
	* @param {Array} quickStartKey 开始截图快捷键keyCode
	* @param {Number} EndKey 结束截图快捷键keyCode
*/

var screenshot = function(quickStartKey, EndKey) {
	this.quickStartKey = quickStartKey;
	this.EndKey = EndKey;
}

screenshot.prototype = {
	init: function() {
		this.copyDomCanvas = null;

		this.startKey()
	},

	startKey: function() {
		var _this = this;
		var keyLength = this.quickStartKey.length
	  var isKeyTrigger = {} //键盘值对象保存
	  var cantStartShot = false
	  
	 
	  this.quickStartKey.forEach(function(item) {
	    isKeyTrigger[item] = false
	  })

	  $('html').on('keyup', function(e) {
	    var keyCode = e.which || e.keyCode;  // 使用 which 或 keyCode, 这样可支持不同浏览器
	    if(keyCode === 27) { // Esc
	      _this.endShot([_this.copyDomCanvas, "#"+canvasId, '.result']) //退出 截屏
	      cantStartShot = false
	    } else if(!cantStartShot) {
	      isKeyTrigger[keyCode] = true
	      var notTrigger = Object.keys(isKeyTrigger).filter(function(item) {
	        return isKeyTrigger[item] === false
	      })
	      if(notTrigger.length === 0) {
	        cantStartShot = true
	        _this.beginShot(cantStartShot)
	      }
	    }
	  })
	},

	beginShot: function(cantStartShot) {
		var _this = this;
		var canvasId = 'canvasPage'
		var canvasId = 'canvasPage'
	  var bGcolor = 'rgba(0, 0, 0, 0.1)' //图层颜色
	  var color = 'rgba(0, 0, 0, 0.1)' //边框颜色
	  var penWidth = 1 // 边框宽度A
		if(cantStartShot) {
      html2canvas(document.body, {
        onrendered: function(canvas) {
          _this.copyDomCanvas = canvas
          document.body.appendChild(_this.copyDomCanvas)
          this._calculateXY = function(e) {
            return {
              x: e.clientX,
              y: e.clientY
            }
          }
          var that = this
          var startX = 0
          var startY = 0
          var isShot = false
          var layerName = 'name' + Math.random() //图层名字，每次删除上一图层
          var canvasWrapperId = 'canvasWrapperId' //最后确定框图
          var css = '<style> .copy-body {position: fixed;top: 0;left: 0;background-color: #ffffff;z-index:1}#' + canvasId + ' {position: fixed;top: 0;left: 0;z-index: 2;}'
          css += '#canvasWrapperId {position: fixed;top: 0;left: 0;z-index: 3;}#shot {display: inline-block;padding: 5px 15px;border: 1px solid #cccccc;border-radius: 5px;cursor: pointer;}'
          css += '.result {position: fixed;z-index: 4;cursor: pointer;}.result a {padding: 5px 15px;border: 1px solid;border-radius: 12px;margin-right: 5px;font-size: 12px;}</style>'
          $('#' + canvasId).remove()
          $('head').append(css)
          $('body').css('cursor', 'crosshair').append('<canvas id='+ canvasId+' width='+ canvas.width +' height='+ canvas.height +'></canvas>') //添加图层用来画选择框
          $(_this.copyDomCanvas).addClass('copy-body') //html转化来的canvas图片作为背景
          $('#' + canvasId).mousedown(function(e) {
              $('.result').remove()
              $("#"+canvasId).removeLayer(layerName)
              layerName += 1
              startX = that._calculateXY(e).x
              startY = that._calculateXY(e).y
              isShot = true
              $("#"+canvasId).addLayer({
                         type: 'rectangle',
                         strokeStyle: color,
                         strokeWidth: penWidth,
                         fillStyle: bGcolor,
                          name:layerName,
                          fromCenter: false,
                          x: startX,
                          y: startY,
                          width: 1,
                          height: 1
              })
          }).mousemove(function(e) {
            if(isShot) {
              $("#"+canvasId).removeLayer(layerName)
              var moveX = that._calculateXY(e).x
              var moveY = that._calculateXY(e).y
              var width = moveX - startX
              var height = moveY - startY
              $("#"+canvasId).addLayer({
                              type: 'rectangle',
                              strokeStyle: color,
                              strokeWidth: penWidth,
                              fillStyle: bGcolor,
                              name:layerName,
                              fromCenter: false,
                              x: startX,
                              y: startY,
                              width: width,
                              height: height
                          })
              $("#"+canvasId).drawLayers();
            }
          }).mouseup(function(e) {
            var moveX = that._calculateXY(e).x
            var moveY = that._calculateXY(e).y
            var width = Math.abs(moveX - startX)
            var height = Math.abs(moveY - startY)
            isShot = false
            $('body').append('<div class="result"><a class="ok">确定</a></div>')
            $('.result').css({
              'top': moveY - startY < 0 ? startY + 10 : moveY + 10,
              'left': moveX - startX < 0 ? startX - 64 : moveX - 64
            })
            $('.ok').click(function() {
              $('body').append('<canvas id="canvasResult" width='+ width +' height='+ height +' style="display:none"></canvas>') //添加图层用来画选择框
              var canvasResult = document.getElementById('canvasResult')
              var ctx = canvasResult.getContext("2d");
              ctx.drawImage(_this.copyDomCanvas, moveX - startX > 0 ? startX : moveX, moveY - startY > 0 ? startY : moveY, width, height, 0, 0, width, height )
              var dataURL = canvasResult.toDataURL("image/png");
              _this.downloadFile($('.ok'), 'screenShot' + Math.random().toString().split('.')[1] || Math.random()  + '.png', dataURL)
              _this.endShot([_this.copyDomCanvas, "#"+canvasId, '.result'])
              $('body').css('cursor', 'default')
            })
          })
        }
      })
    }
	},

	endShot: function(resetObj) {
		if(resetObj) {
      if(Array.isArray(resetObj)) {
        resetObj.forEach(function(item) {
          $(item).remove()
        })
      } else {
        console.error('resetObj must be a Array')
      }
    }
    $('body').css('cursor', 'default');
	},

	downloadFile: function(el, fileName, href) {
		el.attr({
      'download':fileName,
      'href': href
    })
	}

}