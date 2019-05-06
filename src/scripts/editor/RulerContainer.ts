import Utils from '../helpers/Utils';
import DzCanvas from '../helpers/DzCanvas';
import LabelEditor from './LabelEditor';

class RulerContainer {
	public LabelEditor: LabelEditor;
	public labelPanel: any;
	public param: any;
	public element: any;
	public rulerCanvas: any;
	public rulerCtx: any;
	public printPanel: any;
	constructor(el: any) {
		Utils.addListener(window, 'resize', (e: any) => {
			this.refresh();
		});
		// 相关参数；
		this.initParam();
		// 创建并显示标尺视图；
		this.initRulerPanel(el);
		// 将标尺所对应的canvas添加到父容器中
		this.getLabelPanel();
		//
		this.LabelEditor = LabelEditor.getInstance(this.labelPanel);
		// 显示标签
		this.updateLabel();
		// 显示标尺信息；
		this.updateRuler();
	}

	/**
	 * 初始化相关参数；
	 */
	public initParam() {
		this.param = {
			// 标尺到标签的内边距；
			padding: 10,
			// 标尺的宽度；
			rulerWidth: 40,
			posScaleColor: '#5A5A5A',
			negScaleColor: 'red',
		};
	}

	/**
	 * 刷新页面；
	 */
	public refresh() {
		// 先更新标签显示区域；
		this.updateLabel();
		// 然后根据标签的显示情况，实时更新标签刻度标尺；
		this.updateRuler();
	}

	/**
	 * 创建标尺视图；
	 */
	public initRulerPanel(el: any) {
		this.element = Utils.getElement(el);
		this.rulerCanvas = Utils.getCanvas(el);
		this.rulerCanvas.style.position = 'absolute';
		this.rulerCanvas.style.left = 0;
		this.rulerCanvas.style.top = 0;
		this.rulerCanvas.style.backgroundColor = '#008080';
		this.updateRulerSize();

		this.rulerCtx = new DzCanvas(this.rulerCanvas);
		this.rulerCtx.setStrokeColor(this.param.posScaleColor);
		this.rulerCtx.setLineWidth(2);
	}

	/**
	 * 创建用于承载标签的可视区域；
	 */
	public getLabelPanel() {
		this.labelPanel = document.createElement('div');
		this.element.appendChild(this.labelPanel);
		//
		this.labelPanel.style.position = 'absolute';
		this.labelPanel.style.left = this.param.rulerWidth + 'px';
		this.labelPanel.style.top = this.param.rulerWidth + 'px';
		// 再初始化一个隐藏的div，可以测试打印效果；
		this.printPanel = document.createElement('div');
		this.printPanel.style.position = 'absolute';
		this.printPanel.style.display = 'none';
		this.printPanel.style.left = '0px';
		this.printPanel.style.top = '0px';
		this.printPanel.id = 'label-container-print';
		this.element.appendChild(this.printPanel);

		return this.labelPanel;
	}

	public updateLabel() {
		// 更新标签容器的尺寸；
		console.log('{labelWidth:' + this.element.offsetWidth + ', labelHeight:' + this.element.offsetHeight + '}');
		this.labelPanel.style.width = (this.element.offsetWidth - this.param.rulerWidth) + 'px';
		this.labelPanel.style.height = (this.element.offsetHeight - this.param.rulerWidth) + 'px';
		// 跟新打印面板大小；
		this.printPanel.style.width = this.element.offsetWidth + 'px';
		this.printPanel.style.height = this.element.offsetHeight + 'px';

		// 1、更新标尺的位置大小；
		this.LabelEditor.refresh();
	}

	public updateRulerSize() {
		this.rulerCanvas.width = this.element.offsetWidth;
		this.rulerCanvas.height = this.element.offsetHeight;
	}

	/**
	 * 更新标尺面板上的信息；
	 */
	public updateRuler() {
		this.updateRulerSize();
		// 1、获取标签的显示
		const labelRegion = this.LabelEditor.calcShowRegion();
		if (labelRegion.width <= 0 || labelRegion.height <= 0) {
			return;
		}

		// 1、更新标尺的位置大小；
		const cWidth = this.element.offsetWidth;
		const cHeight = this.element.offsetHeight;
		const rulerWidth = this.param.rulerWidth;

		// 2、更新标尺的刻度；
		// 2.1、横向标尺
		const label = this.LabelEditor.LabelControl;
		const unitX = labelRegion.width / label.ShownWidthMM;
		const unitY = labelRegion.height / label.ShownHeightMM;
		this.rulerCtx.fillRect(0, 0, cWidth, rulerWidth, '#F0F0F0');
		// 从标签左上角开始，向右绘制标尺刻度；
		this.rulerCtx.setStrokeColor(this.param.posScaleColor);
		for (let i = 0, posX = labelRegion.x + rulerWidth; posX < cWidth; i++ , posX += unitX) {
			if (i % 10 === 0) {
				this.rulerCtx.drawLine(posX, rulerWidth * 0.1, posX, this.param.rulerWidth);
				// 同时绘制刻度数据
				this.rulerCtx.drawText(i, posX + 3, 18);
			} else if (i % 5 === 0) {
				this.rulerCtx.drawLine(posX, rulerWidth * 0.5, posX, this.param.rulerWidth);
			} else {
				this.rulerCtx.drawLine(posX, rulerWidth * 0.7, posX, this.param.rulerWidth);
			}
		}
		// 从标签的左上角开始，向左绘制标签刻度
		this.rulerCtx.setStrokeColor(this.param.negScaleColor);
		for (let i = 0, posX = labelRegion.x + rulerWidth; posX > rulerWidth; i++ , posX -= unitX) {
			// i = 0已经处理过，跳过；
			if (i === 0) {
				continue;
			}

			if (i % 10 === 0) {
				this.rulerCtx.drawLine(posX, rulerWidth * 0.1, posX, this.param.rulerWidth);
				this.rulerCtx.drawText(-i, posX + 3, 18);
			} else if (i % 5 === 0) {
				this.rulerCtx.drawLine(posX, rulerWidth * 0.5, posX, this.param.rulerWidth);
			} else {
				this.rulerCtx.drawLine(posX, rulerWidth * 0.7, posX, this.param.rulerWidth);
			}
		}
		// 纵向标尺
		this.rulerCtx.fillRect(0, 0, rulerWidth, cHeight, '#F0F0F0');
		// 从左上角开始向下绘制标签刻度;
		this.rulerCtx.setStrokeColor(this.param.posScaleColor);
		for (let i = 0, posY = labelRegion.y + rulerWidth; posY < cHeight; i++ , posY += unitY) {
			if (i % 10 === 0) {
				this.rulerCtx.drawLine(rulerWidth * 0.1, posY, rulerWidth, posY);
				this.rulerCtx.drawText(i, rulerWidth * 0.1, posY + 15);
			} else if (i % 5 === 0) {
				this.rulerCtx.drawLine(rulerWidth * 0.5, posY, rulerWidth, posY);
			} else {
				this.rulerCtx.drawLine(rulerWidth * 0.7, posY, rulerWidth, posY);
			}
		}
		// 从左上角开始，向上绘制标签刻度；
		this.rulerCtx.setStrokeColor(this.param.negScaleColor);
		for (let i = 0, posY = labelRegion.y + rulerWidth; posY > rulerWidth; i++ , posY -= unitY) {
			if (i === 0) {
				continue;
			}
			if (i % 10 === 0) {
				this.rulerCtx.drawLine(rulerWidth * 0.1, posY, this.param.rulerWidth, posY);
				this.rulerCtx.drawText(-i, rulerWidth * 0.1, posY + 15);
			} else if (i % 5 === 0) {
				this.rulerCtx.drawLine(rulerWidth * 0.5, posY, this.param.rulerWidth, posY);
			} else {
				this.rulerCtx.drawLine(rulerWidth * 0.7, posY, this.param.rulerWidth, posY);
			}
		}
	}
}

export default RulerContainer;
