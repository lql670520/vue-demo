/*
    Canvas handle 主函数
 */

export default class LabelImage {
  constructor(options) {
    // 画布宽度
    this.cWidth = 0
    // 画布高度
    this.cHeight = 0
    // 缩略图宽度
    this.sWidth = 0
    // 缩略图高度
    this.sHeight = 0
    // 图片宽度
    this.iWidth = 0
    // 图片高度
    this.iHeight = 0
    // 图片拖拽至边缘最小显示
    this.appearSize = 100
    // 缩放布进
    this.scaleStep = 0.02
    // 最小缩放比例
    this.minScale = 0.2
    // 最大缩放比例
    this.maxScale = 8
    // 图片在画板中的横坐标
    this.x = 0
    // 图片在画板中的纵坐标
    this.y = 0
    // 鼠标当前画板中的横坐标
    this.mouseX = 0
    // 鼠标当前画板中的纵坐标
    this.mouseY = 0
    // 拖动过程中，鼠标前一次移动的横坐标
    this.prevX = 0
    // 拖动过程中，鼠标前一次移动的纵坐标
    this.prevY = 0
    // 缩放比例
    this.scale = 0
    // 鼠标在图片中的横坐标
    this.ix = 0
    // 鼠标在图片中的纵坐标
    this.iy = 0
    // 矩形框起点横坐标
    this.rectX = 0
    // 矩形框起点纵坐标
    this.rectY = 0
    // 绘制多边形的圆点半径
    this.radius = 6

    // 绘制线段宽度
    this.lineWidth = 1
    //绘制区域模块颜色
    this.bgColor = options.bgColor || '#ff0000'
    this.bgColorHover = options.bgColorHover || '#fffd4d'
    //外部传入默认值
    this.defaultParams = options.params
    //绘制区域模块透明度0.30
    this.opacity = 10

    // 是否移动图像标注圆点
    this.isDragCircle = false

    // 当前点击圆点index
    this.snapCircleIndex = 0

    // 用于在拖拽或者缩放时，让绘制至存储面板的数据，只绘制一次
    this.drawFlag = true

    // 监听滚动条缩放是否结束的定时器
    this.mousewheelTimer = null
    // 用于防抖
    this.timeoutDebounce = null
    // 画矩形和画多边形事件
    this.drawEvent = options.drawEvent
    //ocr数据
    this.ocrData = options.ocrData
    // 数据集
    this.dataArray = {
      // 展示数据集（相对于主画布）
      showerData: [],
      // 图片保存数据集（相对于真实图片数据）
      imageData: [],
      // 选中要操作数据的下标
      activetIndex: 0,
      //hover下标
      hoverIndex: 0,
    }
    // 展示节点
    this.showNodes = {
      // 图片节点
      image: null,
      // 主画布节点
      canvas: null,
      // 缩略图节点
      scaleCanvas: null,
      // 缩放比例面板
      scalePanel: null,
      // 画布上下文
      ctx: null,
      // 缩略图画板上下文
      sCtx: null,
      // 缩略图方框
      scaleRect: null,
      // 存储图像数据的画布
      bCanvas: null,
      // 存储图像数据的上下文
      bCtx: null,
      // 绘图部分主外层函数
      canvasMain: options.canvasMain,
      // 标注结果开关按钮
      labelShower: options.labelShower,
    }
    this.features = {
      // 拖动开关
      dragOn: true,
      // 矩形标注开关
      rectOn: true,
      // 多边形标注开关
      polygonOn: false,
      // 标签管理工具
      tagsOn: false,
      // 十字线开关
      crossOn: false,
      // 标注结果显示
      labelOn: true,
    }
    this.Initial()
  }

  //初始化节点参数，绑定各自事件
  Initial = () => {
    let _nodes = this.showNodes
    this.cWidth = _nodes.canvasMain.clientWidth
    this.cHeight = _nodes.canvasMain.clientHeight
    _nodes.canvasMain.innerHTML = ''

    //创建一个主画布
    _nodes.canvas = document.createElement('canvas')
    _nodes.canvas.width = this.cWidth
    _nodes.canvas.height = this.cHeight
    _nodes.canvas.style.background = '#d3d3d3'
    _nodes.canvas.style.cursor = 'crosshair'
    _nodes.ctx = _nodes.canvas.getContext('2d')
    _nodes.canvasMain.appendChild(_nodes.canvas)

    //创建一个缩略图组件,scaleBox，scaleCanvas,scalePanel
    _nodes.scaleCanvas = document.createElement('div')
    Object.assign(_nodes.scaleCanvas.style, {
      position: 'relative',
      width: '150px',
      overflow: 'hidden',
      'z-index': '999',
      cursor: 'pointer',
    })

    _nodes.scalePanel = document.createElement('div')
    Object.assign(_nodes.scalePanel.style, {
      width: '100%',
      'text-align': 'hidden',
      'font-size': '12px',
      color: '#fff',
    })
    const scaleBox = document.createElement('div')
    Object.assign(scaleBox.style, {
      position: 'absolute',
      left: '0',
      bottom: '0',
      padding: ' 6px 6px 0 6px',
      background: '#293245',
      border: '1px solid #3c5167',
      display: 'none',
    })
    scaleBox.appendChild(_nodes.scaleCanvas)
    scaleBox.appendChild(_nodes.scalePanel)
    _nodes.canvasMain.appendChild(scaleBox)

    _nodes.canvas.addEventListener('mousedown', this.canvasMouseDownEvent)
    _nodes.canvas.addEventListener('mousemove', this.canvasMouseMoveEvent)
    _nodes.canvas.addEventListener('contextmenu', LabelImage.noRightMenu.bind(this))
    _nodes.canvas.addEventListener('mousewheel', this.mouseWheelEvent)
    _nodes.canvas.addEventListener('DOMMouseScroll', this.mouseWheelEvent) // 兼容Firefox 滚动条事件

    _nodes.scaleRect = document.createElement('div')
    _nodes.scaleRect.className = 'scaleWindow'
    Object.assign(_nodes.scaleRect.style, { position: 'absolute', border: '1px solid red', boxSizing: 'border-box' })
    _nodes.scaleCanvas.appendChild(_nodes.scaleRect)
    _nodes.scaleCanvas.addEventListener('click', this.scaleCanvasClickEvent)
  }

  // 获取存储数据
  getCanvasData = () => {
    this.dataArray.activetIndex = 0
    this.updateCanvasByShow()
    return JSON.parse(JSON.stringify(this.dataArray.imageData))
  }

  // 设置画布数据
  setCanvasData = (data) => {
    let saveData = JSON.parse(JSON.stringify(data || []))
    // if (!(saveData && saveData.length > 0)) {
    this.dataArray.activetIndex = 0
    this.dataArray.hoverIndex = 0
    // }
    this.dataArray.imageData = saveData
    this.dataToShower()
    this.updateCanvasByShow()
  }

  // 设置高亮的数据
  setHover = (id) => {
    const index = this.dataArray.imageData.findIndex((item) => item.canvasId == id)

    this.dataArray.hoverIndex = index > -1 ? index + 1 : 0
    this.updateCanvasByShow()
  }

  setScale(type) {
    let newScale = this.scale
    if (type == 'add') {
      newScale = this.scale + 0.1 > this.maxScale ? this.maxScale : this.scale + 0.1
    } else if (type == 'diff') {
      newScale = this.scale - 0.1 < this.minScale ? this.minScale : this.scale - 0.1
    }

    if (newScale !== this.scale) {
      // let p = this.getMouseLocationByContainer(e, this.showNodes.canvas)
      let p = {
        x: this.x + (this.iWidth/2) * this.scale,
        y: this.y + (this.iHeight/2) * this.scale,
      }
      let newX = ((this.x - p.x) * newScale) / this.scale + p.x
      let newY = ((this.y - p.y) * newScale) / this.scale + p.y
      this.scale = newScale
      this.setImageLocation(newX, newY)

      this.dataToShower()
      this.updateCanvasByData(false)
    }
  }

  // 设置高亮的数据
  setSelected = (id) => {
    const index = this.dataArray.imageData.findIndex((item) => item.canvasId == id)
    if (index > -1) {
      this.dataArray.activetIndex = index + 1
      this.updateCanvasByShow()
    }
  }
  // 获取选中的对象
  getSelectedObj = () => {
    const index = this.dataArray.activetIndex
    return index > 0 ? this.dataArray.imageData[index - 1] : undefined
  }
  //设置功能参数
  setFeatures = (f, value) => {
    if (f === 'crossOn' || f === 'labelOn') {
      this.features[f] = value
    } else {
      for (let key in this.features) {
        if (key !== 'crossOn' && key !== 'labelOn') {
          this.features[key] = false
        }
      }
    }
    this.features[f] = value

    // 清空选中下标
    this.dataArray.activetIndex = 0
    this.updateCanvasByShow(this.dataArray.activetIndex)
  }

  //设置图片并初始化画板信息
  setImage = (src, data = false, callBack) => {
    let _nodes = this.showNodes
    _nodes.image = new Image()
    _nodes.image.crossOrigin = 'anonymous'
    _nodes.image.src = src
    //监听图片加载
    _nodes.image.addEventListener('load', () => {
      this.iWidth = _nodes.image.width
      this.iHeight = _nodes.image.height
      //获取原有节点
      let beforeCanvas = _nodes.scaleCanvas.querySelectorAll('canvas')
      let bodyCanvas = _nodes.scaleCanvas.querySelector('.bodyCanvas')

      //删除原有节点
      if (beforeCanvas.length > 0) {
        _nodes.scaleCanvas.removeChild(beforeCanvas[0])
      }
      if (bodyCanvas) {
        _nodes.scaleCanvas.removeChild(bodyCanvas)
      }

      // 清空所有数据
      this.dataArray.showerData.splice(0, this.dataArray.showerData.length)
      this.dataArray.imageData.splice(0, this.dataArray.imageData.length)

      //创建缩略图画板
      let sCanvas = document.createElement('canvas')
      _nodes.sCtx = sCanvas.getContext('2d')
      sCanvas.style.display = 'block'
      this.sWidth = parseInt(_nodes.scaleCanvas.getBoundingClientRect().width)
      this.sHeight = parseInt((this.sWidth * this.iHeight) / this.iWidth)
      sCanvas.width = this.sWidth
      sCanvas.height = this.sHeight
      _nodes.scaleCanvas.appendChild(sCanvas)

      // 创建数据存储面板
      _nodes.bCanvas = document.createElement('canvas')
      _nodes.bCanvas.width = this.iWidth
      _nodes.bCanvas.height = this.iHeight
      _nodes.bCanvas.style.display = 'none'
      _nodes.bCanvas.className = 'bodyCanvas'
      _nodes.bCtx = _nodes.bCanvas.getContext('2d')
      _nodes.bCtx.drawImage(_nodes.image, 0, 0, this.iWidth, this.iHeight)
      _nodes.bCtx.translate(0.5, 0.5)
      _nodes.scaleCanvas.appendChild(_nodes.bCanvas)

      // 图片初始定位
      // 初始化自适应缩放图片并居中
      this.scale = 1
      if (this.iWidth > this.cWidth || this.iHeight > this.cHeight) {
        this.scale =
          this.iWidth - this.cWidth > this.iHeight - this.cHeight
            ? this.cWidth / this.iWidth
            : this.cHeight / this.iHeight
      }
      let initImgX = (this.cWidth - this.iWidth * this.scale) / 2
      let initImgY = (this.cHeight - this.iHeight * this.scale) / 2
      this.setImageLocation(initImgX, initImgY)

      this.setCanvasData(data)

      callBack && callBack()
    })
  }

  // 计算是否在圆点上,isEvnet==ture表示进行监听圆点事件
  getInCircle = (isEvent) => {
    // 判断在选中的情况下进行编辑圆点,进行拖拽绘制的圆点
    let _arrays = this.dataArray
    let contents = this.dataArray.showerData[_arrays.activetIndex - 1].content
    if (contents.length > 0) {
      for (let i = 0; i < contents.length; i++) {
        // 使用勾股定理计算鼠标当前位置是否处于当前点上
        let distanceFromCenter = Math.sqrt(
          Math.pow(contents[i].x - this.mouseX, 2) + Math.pow(contents[i].y - this.mouseY, 2)
        )
        if (distanceFromCenter <= this.radius) {
          // 是否监听拖拽事件
          if (isEvent) {
            this.isDragCircle = true
            this.snapCircleIndex = i
            if (_arrays.showerData[_arrays.activetIndex - 1].contentType === 'rect') {
              this.showNodes.canvas.addEventListener('mousemove', this.dragRectCircleRepaintRectEvent)
              this.showNodes.canvas.addEventListener('mouseup', this.removeDragRectCircleRepaintRectEvent)
            } else if (_arrays.showerData[_arrays.activetIndex - 1].contentType === 'polygon') {
              this.showNodes.canvas.addEventListener('mousemove', this.circleDragEvent)
              this.showNodes.canvas.addEventListener('mouseup', this.removeCircleDragEvent)
            }
          }

          return true
        } else {
          if (isEvent) {
            this.isDragCircle = false
          }
        }
      }
    }
    return false
  }
  // 判断是否在矩形内
  getInRect = (isupdate) => {
    let _showerData = this.dataArray.showerData
    let index = 0
    for (let i = _showerData.length - 1; i >= 0; i--) {
      const item = _showerData[i]
      const max_x = Math.max(item.rectMask.xMin, item.rectMask.width + item.rectMask.xMin)
      const max_y = Math.max(item.rectMask.yMin, item.rectMask.height + item.rectMask.yMin)
      const min_x = Math.min(item.rectMask.xMin, item.rectMask.width + item.rectMask.xMin)
      const min_y = Math.min(item.rectMask.yMin, item.rectMask.height + item.rectMask.yMin)

      if (this.mouseX >= min_x && this.mouseY >= min_y && this.mouseX <= max_x && this.mouseY <= max_y) {
        index = i + 1
        break
      }
    }
    // 1.刷新
    // 2.不是拖拽图标
    // 3.不是当前下标
    if (isupdate && this.showNodes.canvas.style.cursor !== 'grabbing' && this.dataArray.activetIndex != index) {
      this.dataArray.activetIndex = index
      this.showNodes.canvas.style.cursor = index > 0 ? 'grabbing' : 'crosshair'
      this.updateCanvasByShow()
    }
    return index
  }

  //监听画板鼠标移动
  canvasMouseMoveEvent = (e) => {
    let _nodes = this.showNodes
    let _arrays = this.dataArray
    this.setMouseLocationByImageCanvas(e)
    if (this.features.dragOn) {
      _nodes.canvas.style.cursor = 'crosshair'
    } else {
      if (_arrays.activetIndex !== 0) {
        if (this.getInRect() == _arrays.activetIndex) {
          _nodes.canvas.style.cursor = 'grabbing'
        } else {
          _nodes.canvas.style.cursor = this.getInCircle() ? 'grabbing' : 'crosshair'
        }
      }
    }
    // if (_arrays.activetIndex !== 0) {
    //   let imageIndexShow = _arrays.showerData[_arrays.activetIndex - 1].content
    //   if (imageIndexShow.length > 0) {
    //     for (let i = 0; i < imageIndexShow.length; i++) {
    //       // 使用勾股定理计算鼠标当前位置是否处于当前点上
    //       let distanceFromCenter = Math.sqrt(
    //         Math.pow(imageIndexShow[i].x - this.mouseX, 2) + Math.pow(imageIndexShow[i].y - this.mouseY, 2)
    //       )
    //       // 改变圆点颜色动画
    //       if (distanceFromCenter <= this.radius) {
    //         _nodes.canvas.style.cursor = 'grabbing'
    //         return
    //       } else {
    //         _nodes.canvas.style.cursor = 'crosshair'
    //       }
    //     }
    //   }
    // }
  }

  //监听画板鼠标点击
  canvasMouseDownEvent = (e) => {
    let _arrays = this.dataArray
    this.setMouseLocationByImageCanvas(e)
    if (e.button === 0) {
      /**
       * 鼠标左击处理
       */

      if (!this.features.dragOn) {
        // 判断是否点击中矩形框
        this.getInRect(true)
        //圆点默认不编辑
        this.isDragCircle = false
        // 判断在选中的情况下进行编辑圆点,进行拖拽绘制的圆点
        _arrays.activetIndex !== 0 && this.getInCircle(true)
      }

      if (!this.isDragCircle) {
        if (this.features.dragOn) {
          this.imageDrag(e) //图片拖拽
        } else {
          if (this.showNodes.canvas.style.cursor == 'grabbing') {
            this.rectDrag(e) //矩形拖拽
          } else {
            if (this.features.rectOn) {
              // 是否开启绘制矩形功能
              this.rectX = this.mouseX
              this.rectY = this.mouseY
              this.showNodes.canvas.addEventListener('mousemove', this.mouseDrawRectEvent)
              this.showNodes.canvas.addEventListener('mouseup', this.mouseDrawRectRemoveEvent)
            } else if (this.features.polygonOn) {
              this.createLabelData(this.mouseX, this.mouseY, 'polygon') // 开启绘画多边型
            }
          }
        }
      }
      // this.isDragCircle = false //圆点默认不编辑
      // if (_arrays.activetIndex !== 0) {
      //   // 判断在选中的情况下进行编辑圆点,进行拖拽绘制的圆点
      //   let imageIndex = _arrays.showerData[_arrays.activetIndex - 1].content

      //   if (imageIndex.length > 0) {
      //     for (let i = 0; i < imageIndex.length; i++) {
      //       // 使用勾股定理计算鼠标当前位置是否处于当前点上
      //       let distanceFromCenter = Math.sqrt(
      //         Math.pow(imageIndex[i].x - this.mouseX, 2) + Math.pow(imageIndex[i].y - this.mouseY, 2)
      //       )
      //       if (distanceFromCenter <= this.radius) {
      //         this.isDragCircle = true
      //         this.snapCircleIndex = i
      //         if (_arrays.showerData[_arrays.activetIndex - 1].contentType === 'rect') {
      //           this.showNodes.canvas.addEventListener('mousemove', this.dragRectCircleRepaintRectEvent)
      //           this.showNodes.canvas.addEventListener('mouseup', this.removeDragRectCircleRepaintRectEvent)
      //         } else if (_arrays.showerData[_arrays.activetIndex - 1].contentType === 'polygon') {
      //           this.showNodes.canvas.addEventListener('mousemove', this.circleDragEvent)
      //           this.showNodes.canvas.addEventListener('mouseup', this.removeCircleDragEvent)
      //         }
      //         return
      //       } else {
      //         this.isDragCircle = false
      //       }
      //     }
      //   }
      // }

      // if (!this.isDragCircle) {
      //   if (this.features.dragOn) {
      //     this.imageDrag(e) //图片拖拽
      //   } else if (this.features.rectOn) {
      //     // 是否开启绘制矩形功能
      //     this.rectX = this.mouseX
      //     this.rectY = this.mouseY
      //     this.showNodes.canvas.addEventListener('mousemove', this.mouseDrawRectEvent)
      //     this.showNodes.canvas.addEventListener('mouseup', this.mouseDrawRectRemoveEvent)
      //   } else if (this.features.polygonOn) {
      //     this.createLabelData(this.mouseX, this.mouseY, 'polygon') // 开启绘画多边型
      //   }
      // }
    } else if (e.button === 2) {
      /**
       * 鼠标右击处理,直接开启拖拽模式
       */
      // this.imageDrag(e)
    }
  }

  //滚动条缩放事件
  mouseWheelEvent = (e) => {
    let wd = e.wheelDelta || e.detail
    let newScale = this.scale * (1 + (wd > 0 ? this.scaleStep : -this.scaleStep))
    newScale = newScale < this.minScale ? this.minScale : newScale
    newScale = newScale > this.maxScale ? this.maxScale : newScale

    if (newScale !== this.scale) {
      let p = this.getMouseLocationByContainer(e, this.showNodes.canvas)
      let newX = ((this.x - p.x) * newScale) / this.scale + p.x
      let newY = ((this.y - p.y) * newScale) / this.scale + p.y
      this.scale = newScale
      this.setImageLocation(newX, newY)
    }
    clearTimeout(this.mousewheelTimer)
    this.mousewheelTimer = setTimeout(() => {
      this.isMouseWheelEnd()
    }, 500)
    if (this.drawFlag) {
      this.updateCanvasByData(true)
      this.drawFlag = false
    }
  }
  //滚动条缩放是否结束
  isMouseWheelEnd = () => {
    this.dataToShower()
    this.updateCanvasByData(false)
    this.drawFlag = true
  }

  // 矩形拖拽
  rectDrag = (e) => {
    let prevP = this.getMouseLocationByContainer(e, this.showNodes.canvas)
    this.prevX = prevP.x
    this.prevY = prevP.y
    this.showNodes.canvas.addEventListener('mousemove', this.rectDragEvent)
    this.showNodes.canvas.addEventListener('mouseup', this.rectDragRemoveEvent)
  }
  //矩形拖拽事件
  rectDragEvent = (e) => {
    this.isRectDragAction = true
    let _nodes = this.showNodes
    let p = this.getMouseLocationByContainer(e, _nodes.canvas)
    let offsetX = p.x - this.prevX
    let offsetY = p.y - this.prevY
    this.setRectLocation(offsetX, offsetY, this.prevX, this.prevY)
    this.prevX = p.x
    this.prevY = p.y
    this.updateCanvasByShow()
  }

  //矩形拖拽删除事件
  rectDragRemoveEvent = () => {
    this.showerToData()
    // this.updateCanvasByData(false);
    this.isRectDragAction = false
    this.showNodes.canvas.removeEventListener('mousemove', this.rectDragEvent)
    this.showNodes.canvas.removeEventListener('mouseup', this.rectDragRemoveEvent)
  }

  // 图片拖拽
  imageDrag = (e) => {
    let prevP = this.getMouseLocationByContainer(e, this.showNodes.canvas)
    this.prevX = prevP.x
    this.prevY = prevP.y
    this.showNodes.canvas.addEventListener('mousemove', this.imageDragEvent)
    this.showNodes.canvas.addEventListener('mouseup', this.imageDragRemoveEvent)
  }

  //图片拖拽事件
  imageDragEvent = (e) => {
    let _nodes = this.showNodes
    let p = this.getMouseLocationByContainer(e, _nodes.canvas)
    let offsetX = p.x - this.prevX
    let offsetY = p.y - this.prevY
    this.setImageLocation(this.x + offsetX, this.y + offsetY)
    this.prevX = p.x
    this.prevY = p.y
    if (this.drawFlag) {
      this.updateCanvasByData(true)
      this.drawFlag = false
    }
  }

  //图片拖拽删除事件
  imageDragRemoveEvent = () => {
    this.dataToShower()
    this.updateCanvasByData(false)
    this.drawFlag = true
    this.showNodes.canvas.removeEventListener('mousemove', this.imageDragEvent)
    this.showNodes.canvas.removeEventListener('mouseup', this.imageDragRemoveEvent)
  }

  //鼠标移动绘制矩形事件
  mouseDrawRectEvent = (e) => {
    this.setMouseLocationByImageCanvas(e)
    this.updateCanvasByShow()
    this.drawRect(this.showNodes.ctx, this.rectX, this.rectY, this.mouseX - this.rectX, this.mouseY - this.rectY)
  }

  //鼠标移动绘制矩形删除事件
  mouseDrawRectRemoveEvent = () => {
    if (this.mouseX - this.rectX >= 5 || this.rectX - this.mouseX >= 5) {
      // 判断矩形绘制距离大于五才认定为有效绘制
      // 保存绘图数据
      this.createLabelData(this.mouseX, this.mouseY, 'rect')
      this.updateCanvasByShow()
      this.showerToData()
    }
    this.showNodes.canvas.removeEventListener('mousemove', this.mouseDrawRectEvent)
    this.showNodes.canvas.removeEventListener('mouseup', this.mouseDrawRectRemoveEvent)
  }

  //圆点拖拽事件，并且重新绘制边缘轨迹点
  circleDragEvent = (e) => {
    this.setMouseLocationByImageCanvas(e)
    let imageIndex = this.dataArray.showerData[this.dataArray.activetIndex - 1].content
    imageIndex[this.snapCircleIndex].x = this.mouseX
    imageIndex[this.snapCircleIndex].y = this.mouseY
    this.updateCanvasByShow()
    this.isDragCircle = true
  }

  //移除圆点拖拽事件, 并重新绘制一遍最新状态
  removeCircleDragEvent = () => {
    let index = this.dataArray.activetIndex - 1
    this.showNodes.canvas.removeEventListener('mousemove', this.circleDragEvent)
    this.showNodes.canvas.removeEventListener('mouseup', this.removeCircleDragEvent)
    // 移除圆点拖拽事件之后，改变被拖拽圆点在矩形蒙层数据中的坐标
    this.calcRectMask(this.dataArray.showerData[index].content)
    this.updateCanvasByShow()
    this.showerToData()
    this.isDragCircle = false
  }

  //拖拽矩形圆点时改变矩形十个点坐标
  dragRectCircleChangeLocation = (content, circleIndex) => {
    switch (circleIndex) {
      case 0:
        content[1].y = this.mouseY
        content[3].x = this.mouseX
        break
      case 1:
        content[0].y = this.mouseY
        content[2].x = this.mouseX
        break
      case 2:
        content[1].x = this.mouseX
        content[3].y = this.mouseY
        break
      case 3:
        content[0].x = this.mouseX
        content[2].y = this.mouseY
        break
      default:
        break
    }
  }

  //拖拽矩形圆点时重新绘制矩形事件
  dragRectCircleRepaintRectEvent = (e) => {
    this.setMouseLocationByImageCanvas(e)
    let imageIndex = this.dataArray.showerData[this.dataArray.activetIndex - 1].content

    this.showNodes.ctx.fillStyle = this.dataArray.showerData[this.dataArray.activetIndex - 1].labelColor + this.opacity

    this.dataArray.showerData[this.dataArray.activetIndex - 1].labelName = this.ocrConversion(
      this.dataArray.showerData[this.dataArray.activetIndex - 1].rectMask
    )

    imageIndex[this.snapCircleIndex].x = this.mouseX
    imageIndex[this.snapCircleIndex].y = this.mouseY
    this.dragRectCircleChangeLocation(imageIndex, this.snapCircleIndex)
    this.calcRectMask(imageIndex)
    this.updateCanvasByShow()
    this.isDragCircle = true //圆点在拖拽
  }

  //移除矩形圆点拖拽事件，并将最新数据绘制到存储面板中
  removeDragRectCircleRepaintRectEvent = () => {
    this.showerToData()
    this.updateCanvasByData(false)
    this.drawFlag = true
    this.showNodes.canvas.removeEventListener('mousemove', this.dragRectCircleRepaintRectEvent)
    this.showNodes.canvas.removeEventListener('mouseup', this.removeDragRectCircleRepaintRectEvent)
    this.isDragCircle = false //圆点在不拖拽
  }

  //缩略图画布点击定位函数
  scaleCanvasClickEvent = (e) => {
    let p = this.getMouseLocationByContainer(e, this.showNodes.scaleCanvas)
    let tmpX = this.cWidth / 2 - (this.iWidth * this.scale * p.x) / this.sWidth
    let tmpY = this.cHeight / 2 - (((this.iWidth * this.scale * p.x) / this.sWidth) * p.y) / p.x
    this.setImageLocation(tmpX, tmpY)
    this.dataToShower()
  }
  //设置当前矩形的坐标
  setRectLocation = (vx, vy, px, py) => {
    const index = this.dataArray.activetIndex - 1
    const showdata = this.dataArray.showerData[index]
    if (showdata) {
      const max_x = Math.max(showdata.rectMask.xMin + vx, showdata.rectMask.xMin + vx + showdata.rectMask.width)
      const max_y = Math.max(showdata.rectMask.yMin + vy, showdata.rectMask.yMin + vy + showdata.rectMask.height)
      const min_x = Math.min(showdata.rectMask.xMin + vx, showdata.rectMask.xMin + vx + showdata.rectMask.width)
      const min_y = Math.min(showdata.rectMask.yMin + vy, showdata.rectMask.yMin + vy + showdata.rectMask.height)
      // 判断是否拖拽到图片外
      if (
        this.x <= min_x &&
        max_x <= this.x + this.iWidth * this.scale &&
        this.y <= min_y &&
        max_y <= this.y + this.iHeight * this.scale
      ) {
        showdata.rectMask = {
          ...showdata.rectMask,
          xMin: showdata.rectMask.xMin + vx,
          yMin: showdata.rectMask.yMin + vy,
        }
        showdata.labelLocation = this.getLabelLocation(showdata.rectMask)
        showdata.content = showdata.content.map((item) => {
          return {
            x: item.x + vx,
            y: item.y + vy,
          }
        })
        showdata.labelName = this.ocrConversion(showdata.rectMask)
        this.dataArray.showerData[index] = showdata
      }
    }
  }
  //设置图片位置，防止图片被拖出画布，同时更新画布
  setImageLocation = (vx, vy) => {
    if (vx < this.appearSize - this.iWidth * this.scale) {
      this.x = this.appearSize - this.iWidth * this.scale
    } else if (vx > this.cWidth - this.appearSize) {
      this.x = this.cWidth - this.appearSize
    } else {
      this.x = vx
    }

    if (vy < this.appearSize - this.iHeight * this.scale) {
      this.y = this.appearSize - this.iHeight * this.scale
    } else if (vy > this.cHeight - this.appearSize) {
      this.y = this.cHeight - this.appearSize
    } else {
      this.y = vy
    }
    this.updateCanvas()
  }

  //设置鼠标在图片画布上的位置
  setMouseLocationByImageCanvas = (e) => {
    let x = e.layerX || e.offsetX
    let y = e.layerY || e.offsetY
    //X坐标点转化， 防止绘制到图片外
    if (x < this.x) {
      x = this.x
    } else if (x > this.iWidth * this.scale + this.x) {
      x = this.iWidth * this.scale + this.x
    }
    //Y坐标点转化， 防止绘制到图片外
    if (y < this.y) {
      y = this.y
    } else if (y > this.iHeight * this.scale + this.y) {
      y = this.iHeight * this.scale + this.y
    }
    this.mouseX = x
    this.mouseY = y
  }

  //获取当前鼠标相对容器的位置
  getMouseLocationByContainer = (e, container, skip) => {
    !skip && e.preventDefault()
    const containerWidth = container.clientWidth
    const containerHeight = container.clientHeight
    const x = typeof e.pageX === 'number' ? e.pageX : e.touches[0].pageX
    const y = typeof e.pageY === 'number' ? e.pageY : e.touches[0].pageY
    let left = x - (container.getBoundingClientRect().left + window.pageXOffset)
    let top = y - (container.getBoundingClientRect().top + window.pageYOffset)

    if (left < 0) {
      left = 0
    } else if (left > containerWidth) {
      left = containerWidth
    }

    if (top < 0) {
      top = 0
    } else if (top > containerHeight) {
      top = containerHeight
    }

    return {
      x: left,
      y: top,
    }
  }

  //计算标签相对于当前标定范围的位置
  getLabelLocation = (rectMask) => {
    let x = rectMask.width / 2 + rectMask.xMin
    let y = rectMask.height / 2 + rectMask.yMin
    return { x, y }
  }

  //通过已保存的坐标点计算矩形蒙层位置与大小，以及标签位置, 添加至数组列表中
  calcRectMask = (arrays) => {
    if (arrays.length >= 2) {
      // 保存边缘矩形框坐标点
      let xMin = arrays[0].x,
        xMax = arrays[0].x,
        yMin = arrays[0].y,
        yMax = arrays[0].y
      arrays.forEach((item) => {
        xMin = xMin < item.x ? xMin : item.x
        xMax = xMax > item.x ? xMax : item.x
        yMin = yMin < item.y ? yMin : item.y
        yMax = yMax > item.y ? yMax : item.y
      })
      let rectMask = {
        xMin: xMin,
        yMin: yMin,
        width: xMax - xMin,
        height: yMax - yMin,
      }

      const labelName = this.ocrConversion(rectMask)
      this.dataArray.showerData[this.dataArray.activetIndex - 1].rectMask = rectMask
      this.dataArray.showerData[this.dataArray.activetIndex - 1].labelName = labelName

      // 计算已创建的标签居中显示
      let labelX = (xMax - xMin) / 2 + xMin
      let labelY = (yMax - yMin) / 2 + yMin
      this.dataArray.showerData[this.dataArray.activetIndex - 1].labelLocation.x = labelX
      this.dataArray.showerData[this.dataArray.activetIndex - 1].labelLocation.y = labelY
    }
  }

  //绘制矩形的方法
  drawRect = (ctx, x, y, width, height, color) => {
    const _color = color || this.bgColor
    ctx.lineWidth = this.lineWidth
    ctx.strokeStyle = _color
    ctx.fillStyle = _color + this.opacity
    ctx.strokeRect(x, y, width, height)
    ctx.fillRect(x, y, width, height)
  }

  //绘制圆点的方法
  drawCircle = (ctx, x, y, color) => {
    ctx.beginPath()
    ctx.fillStyle = '#000'
    ctx.arc(x, y, this.radius, 0, 2 * Math.PI)
    ctx.fill()
    ctx.beginPath()
    ctx.fillStyle = color
    ctx.arc(x, y, this.radius / 3, 0, 2 * Math.PI)
    ctx.fill()
  }

  //绘制标签的方法
  drawRectLabel = (ctx, x, y, color, name, index) => {
    ctx.font = '12px Verdana'
    let txtWidth = ctx.measureText(name).width
    ctx.fillStyle = 'rgba(255,255,255, 0.7)'
    ctx.fillRect(x - txtWidth / 2 - 8, y - 10, txtWidth + 16, 20)
    ctx.fillStyle = color
    ctx.fillText(name, x - txtWidth / 2, y + 4)
  }

  //更新画板数据, 将存储面板数据绘制到展示面板已经缩略图面板
  updateCanvas = () => {
    let _nodes = this.showNodes
    _nodes.ctx.clearRect(0, 0, this.cWidth, this.cHeight)
    _nodes.sCtx.clearRect(0, 0, this.sWidth, (this.sWidth * this.iHeight) / this.iHeight)

    _nodes.ctx.drawImage(
      _nodes.bCanvas,
      -this.x / this.scale,
      -this.y / this.scale,
      this.cWidth / this.scale,
      this.cHeight / this.scale,
      0,
      0,
      this.cWidth,
      this.cHeight
    )
    _nodes.sCtx.drawImage(_nodes.bCanvas, 0, 0, this.iWidth, this.iHeight, 0, 0, this.sWidth, this.sHeight)

    // 将缩略图方框区域绘制到画布
    let width = (this.sWidth * this.cWidth) / this.iWidth / this.scale
    let height = (width * this.cHeight) / this.cWidth
    let left = (-this.x * this.sWidth) / (this.iWidth * this.scale)
    let top = (-this.y * this.sWidth) / (this.iWidth * this.scale)
    // 将方框宽度固定在缩略图面板中
    if (width + left >= this.sWidth) {
      width = this.sWidth - left
      left = this.sWidth - width
      if (width >= this.sWidth) {
        width = this.sWidth
        left = 0
      }
    } else if (left <= 0) {
      width += left
      left = 0
    }

    // 将方框高度固定在缩略图面板中
    if (height + top >= this.sHeight) {
      height = this.sHeight - top
      top = this.sHeight - height
      if (height >= this.sHeight) {
        height = this.sHeight
        top = 0
      }
    } else if (top <= 0) {
      height += top
      top = 0
    }

    _nodes.scaleRect.style.left = left + 'px'
    _nodes.scaleRect.style.top = top + 'px'
    if (width !== Number(_nodes.scaleRect.style.width)) {
      _nodes.scaleRect.style.width = width + 'px'
      _nodes.scaleRect.style.height = height + 'px'
    }

    _nodes.scalePanel.innerText = (this.scale * 100).toFixed(2) + '%'
  }
  // 更新画布数据，（以showerData数据进行重新熏染，且绘至展示画板）
  updateCanvasByShow = (activetIndex) => {
    let _arrays = this.dataArray
    let _nodes = this.showNodes
    _nodes.ctx.clearRect(0, 0, this.cWidth, this.cHeight)
    _nodes.ctx.drawImage(
      _nodes.bCanvas,
      -this.x / this.scale,
      -this.y / this.scale,
      this.cWidth / this.scale,
      this.cHeight / this.scale,
      0,
      0,
      this.cWidth,
      this.cHeight
    )
    _nodes.ctx.setLineDash([0, 0])
    _arrays.showerData.forEach((item, index) => {
      if (item.contentType === 'polygon') {
        // 绘制闭合线条
        _nodes.ctx.beginPath()
        _nodes.ctx.lineWidth = this.lineWidth
        _nodes.ctx.moveTo(item.content[0].x, item.content[0].y)
        item.content.forEach((line) => {
          _nodes.ctx.lineTo(line.x, line.y)
        })
        _nodes.ctx.fillStyle = item.labelColor + this.opacity
        _nodes.ctx.strokeStyle = item.labelColor
        _nodes.ctx.fill()
        _nodes.ctx.closePath()
        _nodes.ctx.stroke()
      } else if (item.contentType === 'rect') {
        this.drawRect(
          _nodes.ctx,
          item.rectMask.xMin,
          item.rectMask.yMin,
          item.rectMask.width,
          item.rectMask.height,
          item.labelColor
        )
      }
      if (_arrays.activetIndex !== 0 && _arrays.activetIndex - 1 === index) {
        item.content.forEach((circle) => {
          // 绘制圆点
          this.drawCircle(_nodes.ctx, circle.x, circle.y, '#20c3f9')
        })
      }
      if (item.content.length >= 2 && item.visibility) {
        // 绘制标签
        this.drawRectLabel(
          _nodes.ctx,
          item.labelLocation.x,
          item.labelLocation.y,
          item.labelColor,
          item.labelName,
          index + 1
        )
      }
      // 绘制矩形蒙层
      if (_arrays.hoverIndex && _arrays.hoverIndex - 1 === index) {
        _nodes.ctx.beginPath()
        _nodes.ctx.lineWidth = this.lineWidth + 1
        _nodes.ctx.strokeStyle = this.bgColorHover
        _nodes.ctx.fillStyle = this.bgColorHover + this.opacity
        _nodes.ctx.strokeRect(item.rectMask.xMin, item.rectMask.yMin, item.rectMask.width, item.rectMask.height)
        _nodes.ctx.fillRect(item.rectMask.xMin, item.rectMask.yMin, item.rectMask.width, item.rectMask.height)
        _nodes.ctx.closePath()
      }
    })
  }

  // 更新画布数据，（以imageData数据进行重新熏染，且绘至存储画板（图片画布））
  updateCanvasByData = (isRender) => {
    let _arrays = this.dataArray
    let _nodes = this.showNodes
    _nodes.bCtx.clearRect(0, 0, this.iWidth, this.iHeight)
    _nodes.bCtx.drawImage(_nodes.image, 0, 0, this.iWidth, this.iHeight)
    if (isRender) {
      _arrays.imageData.forEach((item, index) => {
        if (item.contentType === 'polygon') {
          // 绘制闭合线条
          _nodes.bCtx.beginPath()
          _nodes.bCtx.lineWidth = this.lineWidth
          _nodes.bCtx.moveTo(item.content[0].x, item.content[0].y)
          item.content.forEach((line) => {
            _nodes.bCtx.lineTo(line.x, line.y)
          })

          _nodes.bCtx.fillStyle = item.labelColor + this.opacity
          _nodes.bCtx.strokeStyle = item.labelColor
          _nodes.bCtx.fill()
          _nodes.bCtx.closePath()
          _nodes.bCtx.stroke()
        } else if (item.contentType === 'rect') {
          this.drawRect(
            _nodes.bCtx,
            item.rectMask.xMin,
            item.rectMask.yMin,
            item.rectMask.width,
            item.rectMask.height,
            item.labelColor
          )
        }
        if (_arrays.activetIndex !== 0 && _arrays.activetIndex - 1 === index) {
          item.content.forEach((circle) => {
            // 绘制圆点
            this.drawCircle(_nodes.bCtx, circle.x, circle.y, '#20c3f9')
          })
        }
        if (item.content.length >= 2 && item.visibility) {
          // 绘制标签
          this.drawRectLabel(
            _nodes.bCtx,
            item.labelLocation.x,
            item.labelLocation.y,
            item.labelColor,
            item.labelName,
            index + 1
          )
        }
      })
    }

    !isRender && this.updateCanvasByShow()
  }
  //ocr
  ocrConversion = (data, isFlag) => {
    let str = ''
    this.ocrData &&
      this.ocrData.map((item) => {
        let x = isFlag ? data.xMin : (data.xMin - this.x) / this.scale
        let y = isFlag ? data.xMin : (data.yMin - this.y) / this.scale
        let w = isFlag ? data.width : data.width / this.scale
        let h = isFlag ? data.height : data.height / this.scale

        if (w < 0) {
          //将各种角度转换成左上到右下
          x += w
          w *= -1
        }
        if (h < 0) {
          //将各种角度转换成左上到右下
          y += h
          h *= -1
        }
        //
        // if (
        //   (x <= item.location.left &&
        //     x + w >= item.location.left &&
        //     (y <= item.location.top && y + h >= item.location.top)) ||
        //   (x <= item.location.left &&
        //     x + w >= item.location.left + item.location.width &&
        //     (y <= item.location.top && y + h >= item.location.top + item.location.height))
        // ) {
        //   str += item.char
        // }
        if (
          (x <= item.location._left &&
            x + w >= item.location._left &&
            (y <= item.location._top && y + h >= item.location._top))
        ) {
          str += item.char
        }
      })
    return str
  }
  //创建新的标注数据
  createLabelData = (lx, ly, contentType) => {
    if (contentType === 'rect') {
      //设置编辑下标
      this.dataArray.activetIndex = this.dataArray.showerData.length + 1

      let rectMask = {
        xMin: this.rectX,
        yMin: this.rectY,
        width: this.mouseX - this.rectX,
        height: this.mouseY - this.rectY,
      }
      const labelName = this.ocrConversion(rectMask)
      this.dataArray.showerData.push({
        ...this.defaultParams,
        canvasId: this.uuid2(),
        labelName: labelName || '',
        labelColor: this.bgColor,
        visibility: this.showNodes.labelShower,
        labelLocation: this.getLabelLocation(rectMask),
        rectMask,
        contentType: contentType,
        content: [
          { x: this.rectX, y: this.rectY },
          { x: this.mouseX, y: this.rectY },
          { x: this.mouseX, y: this.mouseY },
          { x: this.rectX, y: this.mouseY },
        ],
      })

      this.showerToData()
    } else if (contentType === 'polygon') {
      // 开启绘画多边型
      if (this.dataArray.activetIndex === 0) {
        this.dataArray.activetIndex = this.dataArray.showerData.length + 1

        this.dataArray.showerData.push({
          ...this.defaultParams,
          canvasId: this.uuid2(),
          labelName: '',
          labelColor: this.bgColor,
          visibility: this.showNodes.labelShower,

          labelLocation: {
            x: lx,
            y: ly,
          },
          contentType: contentType,
          content: [],
          rectMask: {},
        })
      }
      //画点（圆点不在拖拽的情况下）
      if (!this.isDragCircle) {
        let index = this.dataArray.activetIndex - 1
        // 保存坐标点
        this.dataArray.showerData[index].content.push({ x: lx, y: ly })
        this.calcRectMask(this.dataArray.showerData[index].content)
        this.showerToData()
        this.updateCanvasByShow()
      }
    }
  }

  //展示数据集转化成存储数据(坐标转化过程)
  showerToData = () => {
    this.dataArray.imageData.splice(0, this.dataArray.imageData.length)
    this.dataArray.showerData.map((item) => {
      let content = []
      item.content.forEach((contents) => {
        content.push({
          x: (contents.x - this.x) / this.scale,
          y: (contents.y - this.y) / this.scale,
        })
      })
      let rectMask = {
        xMin: (item.rectMask.xMin - this.x) / this.scale,
        yMin: (item.rectMask.yMin - this.y) / this.scale,
        width: item.rectMask.width / this.scale,
        height: item.rectMask.height / this.scale,
      }
      const labels = {
        canvasId: item.canvasId,
        labelName: item.labelName,
        labelColor: item.labelColor,
        visibility: item.visibility,
      }

      this.dataArray.imageData.push({
        ...item,
        ...labels,
        content,
        rectMask,
        labelLocation: this.getLabelLocation(rectMask),
        contentType: item.contentType,
      })
    })

    this.drawEvent && this.debounce(() => this.drawEvent(JSON.parse(JSON.stringify(this.dataArray.imageData))), 200)
  }

  // 存储数据集转化成展示数据(坐标转化过程)
  dataToShower = () => {
    this.dataArray.showerData.splice(0, this.dataArray.showerData.length)
    this.dataArray.imageData.map((item, index) => {
      let content = []
      item.content.forEach((contents) => {
        content.push({
          x: contents.x * this.scale + this.x,
          y: contents.y * this.scale + this.y,
        })
      })
      let rectMask = {
        xMin: item.rectMask.xMin * this.scale + this.x,
        yMin: item.rectMask.yMin * this.scale + this.y,
        width: item.rectMask.width * this.scale,
        height: item.rectMask.height * this.scale,
      }
      const labels = {
        canvasId: item.canvasId,
        labelName: item.labelName,
        labelColor: item.labelColor,
        visibility: item.visibility,
      }
      this.dataArray.showerData.push({
        ...item,
        ...labels,
        content,
        rectMask,
        // labels: item.labels,
        labelLocation: this.getLabelLocation(rectMask),
        contentType: item.contentType,
      })
    })
  }

  // 防抖
  debounce = (fn, delay) => {
    // 每当操作时,把之前的计时器清零
    this.timeoutDebounce && clearTimeout(this.timeoutDebounce)

    // 然后又创建一个新的 setTimeout, 这样就能保证interval 间隔内如果时间持续触发，就不会执 行 fn 函数
    this.timeoutDebounce = setTimeout(() => {
      fn()
    }, delay)
  }

  uuid2 = (len, radix) => {
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('')
    var uuid = [],
      i
    radix = radix || chars.length

    if (len) {
      // Compact form
      for (i = 0; i < len; i++) uuid[i] = chars[0 | (Math.random() * radix)]
    } else {
      // rfc4122, version 4 form
      var r

      // rfc4122 requires these characters
      uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-'
      uuid[14] = '4'

      // Fill in random data.  At i==19 set the high bits of clock sequence as
      // per rfc4122, sec. 4.1.5
      for (i = 0; i < 36; i++) {
        if (!uuid[i]) {
          r = 0 | (Math.random() * 16)
          uuid[i] = chars[i == 19 ? (r & 0x3) | 0x8 : r]
        }
      }
    }

    return uuid.join('')
  }

  /*
		画板禁止触发右键菜单事件
	 */
  static noRightMenu(event) {
    event.preventDefault()
  }
}
