import DzCanvas from '../helpers/DzCanvas';
import WebAPI from './WebAPI';
import PrintParam from './PrintParam';
import LabelView from '../editor/LabelView';

class PrintManager {
	// =========================== //
	// 静态函数区域
	// =========================== //
	public static getInstance(): PrintManager {
		if (!PrintManager.sInstance) {
			PrintManager.sInstance = new PrintManager();
		}

		return PrintManager.sInstance;
	}
	public static print(label: LabelView) {
		PrintManager.getInstance().printLabel(label);
	}

	public static getAllPrinters() {
		return PrintManager.getInstance().getAllPrinters();
	}

	public static setCurrPrinter(value: any) {
		PrintManager.getInstance().setCurrPrinter(value);
	}

	// ================================== //
	// 静态属性区域；
	// ================================== //
	private static sInstance: PrintManager;

	// ================================== //
	// 费静态属性区域；
	// ================================== //
	private webApi: WebAPI = new WebAPI();
	private printParam: PrintParam | null = null;

	private printPage: HTMLCanvasElement;
	private printContainer: HTMLElement | null;
	private context: DzCanvas;
	private currPrinter: any;

	constructor() {
		this.printPage = document.createElement('canvas');
		this.printPage.style.backgroundColor = 'white';
		this.printContainer = document.getElementById('label-container-print');
		if (this.printContainer instanceof HTMLElement) {
			this.printContainer.appendChild(this.printPage);
		}
		this.context = new DzCanvas(this.printPage);
	}

	public printLabel(label: LabelView) {
		if (!(label instanceof LabelView)) {
			return false;
		}
		// 1、打开打印机；
		const printer = this.currPrinter || this.getDefaultPrinter();
		if (!printer) {
			return false;
		}
		if (!this.webApi.openPrinter(printer)) {
			return false;
		}
		// 2、获取打印机分辨率
		const dpi = 203;

		// 2、设置打印参数；
		if (this.printParam) {
			this.printParam.CurrLabel = label;
		} else {
			this.printParam = new PrintParam(label);
		}
		this.printParam.Dpi = dpi;

		// 3、创建打印任务；
		this.printPage.width = this.printParam.ShownWidth;
		this.printPage.height = this.printParam.ShownHeight;

		// 4、渲染打印任务；
		label.renderLabel(this.context, this.printParam);

		// 5、提交打印任务，开始打印；
		this.webApi.printImage({
			data: this.printPage.toDataURL(),
			orientation: this.printParam.Rotation,
		});
	}
	private getAllPrinters() {
		return this.webApi.getPrinters(null);
	}

	private setCurrPrinter(value: any) {
		this.currPrinter = value;
	}

	private getDefaultPrinter() {
		let currPrinter: any;
		let printers = this.webApi.getPrinters(null);
		printers = printers ? printers.printers : [];
		printers.forEach((item: any) => {
			if (item.type === 1) {
				currPrinter = item;
			} else if (!currPrinter) {
				currPrinter = item;
			}
		});

		return currPrinter;
	}
}

export default PrintManager;
