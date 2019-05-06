const defaultLineWidth = 0.3;
const defaultCornerRadius = 1.5;
const defaultTimeout = 2000;

/**
 * 将参数转换为url字符串；
 */
function getParamString(data: any) {
	data = data || {};
	let values = '';
	for (const key in data) {
		if (data.hasOwnProperty(key) && data[key] != null) {
			values = appendUrl(values, key, data[key]);
		}
	}

	return values;
}

function getUrl(ipAddress: string, action: string) {
	const url = ipAddress || '127.0.0.1';
	return (url.match(/^http:\/\/.*/i) ? url : 'http://' + url) + ':15216/lpapi/' + action;
}

/**
 * 将给定的key和value值拼接到给定的url上；
 * @param {string} url 待扩展字符串
 * @param {string} key 需要拼接的key值
 * @param {string} value 需要拼接的value值
 */
function appendUrl(url: string, key: string, value: string) {
	url = url || '';
	// ley 只接受字符串类型；
	if (typeof key !== 'string') {
		return url;
	}
	// value 只接受基本数据类型；
	if (value === undefined || value === null) {
		return url;
	}
	if (typeof value === 'function' || typeof value === 'object') {
		return url;
	}

	if (url.length > 0) {
		url += '&';
	}
	url += (key + '=' + encodeURIComponent(value));
	return url;
}


/**
 * 请求失败是的返回结果枚举信息；
 */
const Result = {
	LPA_OK: 0,                          // < 成功。
	LPA_PARAM_ERROR: 1,                 // < 函数参数错误。
	LPA_SYSTEM_ERROR: 2,                // < 系统错误，如创建 Windows 对象失败、内存不足等。
	LPA_NOSUPPORTED_PRINTER: 3,         // < 没有找到 LabelPrintAPI 支持的打印机。
	LPA_UNSUPPORTED_PRINTER: 4,         // < LabelPrintAPI 不支持指定名称的打印机。
	LPA_NOPRINTDATA: 5,                 // < 没有需要打印的数据。
	LPA_NOPAGEDIMENSION: 6,             // < 没有打印页面尺寸信息。
	LPA_INVALID_FILE: 7,                // < 无效的图片文件。
};

/**
 * LabelPrintAPI 位图点阵数据格式。位图数据从上至下，从左至右。
 */
const BitmapFormat = {
	LPASIF_RAWDATA: 0,          // < 直接传递给打印机的原始打印数据。
	LPASIF_BPP_1: 1,                  // < 每个点用一个比特位表示的黑白点阵数据，1 表示黑点（需要打印），0 表示白点。
	// < LPASIF数据从上至下按照行来存放，每行需要的字节数为 (width + 7) / 8。
	// < 每个字节表示 8 个点，高位表示左边的点，低位表示右边的点。
	LPASIF_BPP_1N: 2,           // < 同 LPASIF_BPP_1，只是 0 表示黑点（需要打印），1 表示白点。
	LPASIF_32_RGBA: 32,         // < 每个点用四个字节表示的点阵数据，四个字节依次表示 RGBA。
	LPASIF_32_BGRA: 33,         // < 每个点用四个字节表示的点阵数据，四个字节依次表示 BGRA。
	LPASIF_32_RGB: 34,          // < 每个点用四个字节表示的点阵数据，四个字节依次表示 RGB，最高字节未使用。
	LPASIF_32_BGR: 35,          // < 每个点用四个字节表示的点阵数据，四个字节依次表示 BGR，最高字节未使用。
	LPASIF_PACKAGE: 90,         // < 简易报文格式的点阵数据，1 表示黑点（需要打印），0 表示白点，对于标签打印而言，压缩效率还是不错的。
	// < 打印行：Ax 前导零字节数 打印字节数 xxxxxx
	// <        首字节的4个比特，给前导零用2位，给打印字节用2位，也就是说打印数据最多为1K字节，8K个点。
	// < 打印行：B0 xxxxxx
	// <        打印字节数等于点阵数据的行字节数，(width + 7) / 8。
	// < 重复行：Bx
	// <        首字节的4个比特，给行数使用，也就是说行数最大值为 15。
	// < 空白行：110xxxxx（也即 Cx/Dx）
	// <        首字节的5个比特，给行数使用，也就是说行数最大值为 31。
};

/**
 * LabelPrintAPI 位图点阵数据格式。位图数据从上至下，从左至右。
 */
const SourceImageFormat = {
	LPASIF_RAWDATA: 0,          // < 直接传递给打印机的原始打印数据。

	LPASIF_BPP_1: 1,            // < 每个点用一个比特位表示的黑白点阵数据，1 表示黑点（需要打印），0 表示白点。
	// < 数据从上至下按照行来存放，每行需要的字节数为 (width + 7) / 8。
	// < 每个字节表示 8 个点，高位表示左边的点，低位表示右边的点。
	LPASIF_BPP_1N: 2,           // < 同 LPASIF_BPP_1，只是 0 表示黑点（需要打印），1 表示白点。

	LPASIF_32_RGBA: 32,         // < 每个点用四个字节表示的点阵数据，四个字节依次表示 RGBA。
	LPASIF_32_BGRA: 33,         // < 每个点用四个字节表示的点阵数据，四个字节依次表示 BGRA。
	LPASIF_32_RGB: 34,          // < 每个点用四个字节表示的点阵数据，四个字节依次表示 RGB，最高字节未使用。
	LPASIF_32_BGR: 35,          // < 每个点用四个字节表示的点阵数据，四个字节依次表示 BGR，最高字节未使用。

	LPASIF_PACKAGE: 90,         // < 简易报文格式的点阵数据，1 表示黑点（需要打印），0 表示白点，对于标签打印而言，压缩效率还是不错的。
	// < 打印行：Ax 前导零字节数 打印字节数 xxxxxx
	// <        首字节的4个比特，给前导零用2位，给打印字节用2位，也就是说打印数据最多为1K字节，8K个点。
	// < 打印行：B0 xxxxxx
	// <        打印字节数等于点阵数据的行字节数，(width + 7) / 8。
	// < 重复行：Bx
	// <        首字节的4个比特，给行数使用，也就是说行数最大值为 15。
	// < 空白行：110xxxxx（也即 Cx/Dx）
	// <        首字节的5个比特，给行数使用，也就是说行数最大值为 31。
	LPASIF_IMAGEDATA: 93,       // < 图片文件数据，支持 PNG/JPG/BMP 等几乎所有常见图片文件格式。
	// < 如果图片文件数据采用 Base64 编码（通过设置 dLen = 0 实现），则会自动过滤字符串开始的诸如
	// < “data:image/png;base64,”的头部字符串，这种头部字符串一般在 JS 中被广泛使用，用于指示图片
	// < 数据格式。接口会自动查找头部的部分字符，一直找到“,”为止。如果没有找到“,”，则数据从头开始。
};

/**
 * LabelPrintAPI 预览用图片数据格式。
 */
const TargetImageFormat = {
	LPATIF_32_RGBA: 32,             // < 两个字节表示宽度，两个字节表示高度，都是高字节在前面。后面跟着点阵数据，
	// < 每个点用四个字节表示的点阵数据，四个字节依次表示 RGBA。
	LPATIF_32_BGRA: 33,             // < 两个字节表示宽度，两个字节表示高度，都是高字节在前面。后面跟着点阵数据，
	// < 每个点用四个字节表示的点阵数据，四个字节依次表示 BGRA。
	LPATIF_BASE64P_PNG: 95,         // < PNG 图片文件的BASE64编码，同时加上了 “data:image/png;base64,”前缀，
	// < 因此返回的字符串可以直接赋值给 HTML 对象的 src 属性，进行图片预览。
	LPATIF_BASE64_PNG: 96,	        // < PNG 图片文件二进制内容的BASE64编码。
	LPATIF_RAWDATA_PNG: 97,         // < PNG 图片文件的二进制内容。
};

/**
 * 打印参数ID，GetParam() SetParam() 中使用。
 */
const ParamID = {
	gapType: 1,			        // < 纸张类型, 对应的value值有效区域为：0-3，255表示随打印机；具体可参考属性GapType；
	printDarkness: 2,           // < 打印浓度，对应的value值有效区域为： 0-14，255表示随打印机；
	printSpeed: 3,              // < 打印速度，对应的value值有效区域为：0-4，255表示随打印机；
};

/**
 * 纸张间隔类型。
 */
const GapType = {
	unset: 255,            // < 随打印机
	none: 0,               // < 连续纸，没有分隔
	hole: 1,               // < 定位孔
	gap: 2,                // < 间隙纸
	black: 3,              // < 黑标纸
};

/**
 * 打印动作的对齐方式。
 */
const ItemAlignment = {
	Near: 0,        // < 水平居左/垂直居上
	Center: 1,        // < 水平居中/垂直居中
	Far: 2,        // < 水平居右/垂直居下

	SameAsItem: 3,        // < 对象子元素的对齐方式同对象的对齐方式，
	// < 当前在一维码文本的水平对齐方式中使用

	Left: 0,          // < 水平居左
	Right: 2,         // < 水平居右

	Top: 0,	          // < 垂直居上
	Middle: 1,        // < 垂直居中
	Bottom: 2,        // < 垂直居下
};

/**
 * 线条画笔对齐方式。
 */
const PenAlignment = {
	Center: 0,                  // < 绘制的线以指定的位置为中央
	Inset: 1,                   // < 绘制的线在指定的位置内侧
};

/**
 * 字体风格。
 */
const FontStyle = {
	Regular: 0,          // < 一般
	Bold: 1,          // < 粗体
	Italic: 2,          // < 斜体
	BoldItalic: 3,          // < 粗斜体
	Underline: 4,          // < 下划线
	Strikeout: 8,          // < 删除线
};

/**
 * 一维条码编码类型。
 */
const BarcodeType = {
	// < UPC-A, UPC-E, EAN13, EAN8, ISBN 统称为商品码，编码和显示方式类似；
	// < 只能包含数字，对于支持两段的方式的编码，使用“+”来作为前后两段的分隔；
	// < 都有校验字符，一般为0～9。对于 ISBN 编码，其校验字符可能为“X”。
	LPA_1DBT_UPC_A: 20,            // < 支持长度为：12、12+2、12+5，显示为 1+5+5+1
	// < 输入长度为 12：表示已经有校验码；
	// <           11：没有校验码，程序会自动添加；
	// <         < 11：加上前导零，然后自动添加校验码；
	LPA_1DBT_UPC_E: 21,            // < 支持长度为：8、8+2、8+5，显示为1+6+1。其中第一位是编码数字类型，只
	// < 能为0/1，表示采用的数字系统；第八位是校验位，采用 upc_check() 进行校验。
	// < 输入长度为 8：表示已经有校验码，如果第一个字符不是0/1，则强制换成0来处理；
	// <           7：没有校验码，程序会自动添加。如果第一个字符不是0/1，则强制换成0来处理；
	// <           6：没有校验码，程序会自动添加。同时采用数字系统 0 来进行编码。
	// <         < 6：加上前导 0 到长度为 6 之后，再进行编码。
	LPA_1DBT_EAN13: 22,            // < 支持长度为：13、13+2、13+5、8、8+2、8+5、5、2。
	// < 输入长度为 13：表示已经有校验码；
	// <           12：没有校验码，程序会自动添加；
	// <         6~11：加上前导零之后，当成长度为 12 的处理；
	// < 输入长度为 3/4/5：表示编码成长度为 5 的附加条码；
	// <             1/2：表示编码成长度为 2 的附加条码。
	LPA_1DBT_EAN8: 23,             // < 在内部和 EAN13 编码统一处理
	// < 输入长度为 8：表示已经有校验码；
	// < 输入长度大于 8 时，切换成 EAN13 码进行编码；
	// < 输入长度 <= 5 时，切换成 EAN13 码进行编码；
	// < 输入长度为 7：没有校验码，程序会自动添加；
	// <           6：加上前导零，然后自动添加校验码；

	LPA_1DBT_CODE39: 24,           // < 1、'0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ-. $/+%'
	// < 2、以 * 为显示用引导和结束字符（编码中没有，仅仅显示用）
	// < 3、每个字符用10个编码（显示长度为13）
	// < 4、引导字符10个（显示长度为13），结束字符9个（显示长度12）
	// < ==》字符数为 10+ 9+10×N
	// <        显示长度 13+12+13×N
	// <        10个字符 13+12+13×10 = 155像素
	// < 如果编码内容中包含不支持的字符，则会切换成 CODE 128 编码；

	LPA_1DBT_ITF25: 25,            // < 1、0~9
	// < 2、加校验码之后长度必须是偶数，否则在头部加上 0
	// < 3、每个字符用5个编码（显示长度为 7）
	// < 4、引导字符 4 个（显示长度为 4），结尾字符 3 个（显示长度是 4）
	// < ==》字符数为 4 + 3 + 10*（N/2）
	// <        显示长度 4 + 4 + 14*（N/2）
	// <        10个字符 4+4+14×5 = 78像素
	// < 如果编码内容中包含不支持的字符，则会切换成 CODE 128 编码；

	LPA_1DBT_CODABAR: 26,          // < 1、'0123456789-$:/.+ABCD'，多应用于医疗领域
	// < 2、引导/结束字符 A～D，都会被转化为大写
	// < 3、加上引导字符/校验码之后，数据统一编码；
	// < 4、每个字符用8个编码（显示长度为 10～11）
	// < ==》字符数为 8×N，显示长度为 10×N～11×N
	// <        10个字符10×10 + 11×2 = 122像素
	// < 如果编码内容中包含不支持的字符，则会切换成 CODE 128 编码；

	LPA_1DBT_CODE93: 27,           // < 0x00～0x7F
	// < 如果编码内容中包含不支持的字符，则会切换成 CODE 128 编码；

	LPA_1DBT_CODE128: 28,          // < 0x00～0xFF，CODE 128 A/B 支持全字符，对于 CODE 128 C 编码：
	// < 1、有固定方式的校验码，都是数字，必须是偶数长度
	// < 2、引导字符 105，结束字符 106
	// < 3、条码宽度范围为1～4，每个字符用7个编码（显示长度为11）
	// < ==》字符数为 7+7+7+7×（N/2）
	// <        显示长度 11+11+11+11×（N/2）
	// <        10个字符 11+11+11+11×（10/2）= 88像素

	LPA_1DBT_ISBN: 29,             // < 0~9，最后一位可能为 0~9, X（校验字符）
	// < 13：必须是 978/979 前导，用 EAN13 编码，isbn13_check
	// < 10：加上 978 前导之后，用 EAN13 编码，isbn_check
	// < <=9：加上 0 前导之后，Check，然后再加上 978 前导，用 EAN 13 编码
	// < 如果编码内容中包含不支持的字符，则会切换成 CODE 128 编码；

	LPA_1DBT_ECODE39: 30,          // < EXTENDED CODE 39，0x00～0x7F
	// < 对于 CODE 39 不支持的字符，采用转义之后，用两个字符来表示
	// < 如果编码内容中包含不支持的字符，则会切换成 CODE 128 编码；

	LPA_1DBT_AUTO: 60,            // < 根据编码内容，自动选择最适合的编码类型进行编码。
	// < 1、ITF25（内容长度为偶数，并且全部为数字时）
	// < 2、CODABAR（如果内容以A/B/C/D开头，又以A/B/C/D结尾的话）
	// < 3、CODE 39
	// < 4、CODE 128
};

function emptyFunc() {
	// 什么都不做，用于解决编译时候报 block is empty的警告；
}

/**
 * 标签打印机类，对OCX插件对象的封装
 */
class WebAPI {
	public type: string = 'POST';
	public timeout: number;

	private ipAddress: string = '127.0.0.1';
	private fontName: string = '黑体';

	constructor() {
		this.timeout = defaultTimeout;
	}

	/**
	 * 请求失败是的返回结果枚举信息；
	 */
	public get Result() {
		return Result;
	}

	/**
	 * LabelPrintAPI 位图点阵数据格式。位图数据从上至下，从左至右。
	 */
	public get BitmapFormat() {
		return BitmapFormat;
	}

	/**
	 * LabelPrintAPI 位图点阵数据格式。位图数据从上至下，从左至右。
	 */
	public get SourceImageFormat() {
		return SourceImageFormat;
	}

	/**
	 * LabelPrintAPI 预览用图片数据格式。
	 */
	public get TargetImageFormat() {
		return TargetImageFormat;
	}

	/**
	 * 打印参数ID，GetParam() SetParam() 中使用。
	 */
	public get ParamID() {
		return ParamID;
	}

	/**
	 * 纸张间隔类型。
	 */
	public get GapType() {
		return GapType;
	}

	/**
	 * 打印动作的对齐方式。
	 */
	public get ItemAlignment() {
		return ItemAlignment;
	}

	/**
	 * 线条画笔对齐方式。
	 */
	public get PenAlignment() {
		return PenAlignment;
	}

	/**
	 * 字体风格。
	 */
	public get FontStyle() {
		return FontStyle;
	}

	/**
	 * 一维条码编码类型。
	 */
	public get BarcodeType() {
		return BarcodeType;
	}

	/**
	 * 验证请求url是否可用；
	 * @param {function} success url校验成功；DTPweb服务可用；
	 * @param {function} fail url校验失败，接口不可用，要确保DTPWeb已安装，如果已安装可以尝试着重启下电脑；
	 */
	public checkUrl(success: () => any, fail: () => any) {
		const url = getUrl(this.ipAddress, 'IsPrinterOpened');
		// eslint-disable-next-line no-undef
		const xmlhttp = XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
		//
		success = success || emptyFunc;
		let failBak = fail || (() => {
			const msg = 'DTPWeb服务 URL检测失败！\n' +
				'1、请确保已安装包含DTPWeb服务功能的相关软件产品；\n' +
				'2、如果已安装，则尝试重启电脑（部分电脑DTPWeb服务需要重启电脑后生效）；';
			alert(msg);
		});
		fail = () => {
			// 为了避免重复的回调fail接口，所以再次进行下处理；
			if (typeof failBak === 'function') {
				failBak();
				failBak = emptyFunc;
			}
		};
		// 请求结果处理函数；
		xmlhttp.onreadystatechange = () => {
			// readyState == 4表示响应内容加载完毕；
			if (xmlhttp.readyState === 4) {
				// IE个坑货，有时候调用 xmlhttp.status 比较的时候会抛异常，所以需要try catch下
				try {
					if (xmlhttp.status === 200) {
						success();
					} else {
						fail();
					}
				} catch (e) {
					console.log(e);
				}
			}
		};
		// 请求超时，低版本IE浏览器有效；
		xmlhttp.ontimeout = () => {
			if (typeof fail === 'function') {
				fail();
			}
		};

		try {
			// 通过异步请求来检测url是否可用，避免假死状态；
			xmlhttp.open('GET', url, true);
			xmlhttp.timeout = this.timeout || defaultTimeout;
			xmlhttp.send();
		} catch (e) {
			if (console) {
				console.log(e);
			}
		}
	}

	/**
	 * 获取打印动作的顺时针旋转角度
	 */
	public getItemOrientation(): any {
		return this.requestApi('GetItemOrientation').resultInfo;
	}

	/**
	 * 设置后续打印动作的顺时针旋转角度
	 * @param {object} data 参数列表：
	 *  {
	 *      orientation,        // 旋转角度，value值为：0、90、180、270
	 *  }
	 */
	public setItemOrientation(data: any) {
		data = typeof data === 'object' ? data : { orientation: arguments[0] };
		if (typeof data.orientation !== 'number') { return; }

		this.requestApi('SetItemOrientation', data);
	}

	/**
	 * 获取打印动作的水平对齐方式
	 */
	public getItemHorizontalAlignment() {
		return this.requestApi('GetItemHorizontalAlignment', null).resultInfo;
	}

	/**
	 * 设置后续打印动作的水平对齐方式
	 * @param {object} data 接口调用参数列表；
	 *   {
	 *       alignment      // 对其方式，0：左对齐，1：居中对其，2：右对齐；
	 *   }
	 */
	public setItemHorizontalAlignment(data: any) {
		data = typeof data === 'object' ? data : { alignment: arguments[0] };
		if (typeof data.alignment !== 'number') {
			return -1;
		}

		this.requestApi('SetItemHorizontalAlignment', data);
	}

	/**
	 * 获取当前打印动作的垂直对齐方式
	 */
	public getItemVerticalAlignment() {
		return this.requestApi('GetItemVerticalAlignment', null).resultInfo;
	}

	/**
	 * 设置后续打印动作的垂直对齐方式
	 * @param {object} data 接口调用参数列表；
	 *   {
	 *       alignment : 0   // 0：垂直居上;1：垂直居中；2：垂直居下
	 *   }
	 */
	public setItemVerticalAlignment(data: any) {
		data = typeof data === 'object' ? data : { alignment: data };
		if (typeof data.alignment !== 'number') {
			return -1;
		}

		this.requestApi('SetItemVerticalAlignment', data);
	}

	/**
	 *  打开指定名称的打印机对象。
	 * @param {object} data 参数列表；
	 *  {
	 *      printerName,        // 可选，getPrinters获取到的打印机名称；
	 *      ip                  // 可选，通过getPrinters获取到的打印机所连接的局域网设备，不指定，则表示本地打印机；
	 *  }
	 */
	public openPrinter(data: any) {
		data = typeof data === 'object' ? data : { printerName: arguments[0], ip: arguments[1] };

		if (typeof data.ip === 'string') {
			this.ipAddress = data.ip;
		}

		return this.requestApi('OpenPrinter', data).statusCode === 0;
	}

	/**
	 * 得到当前使用的打印机名称.
	 */
	public getPrinterName() {
		const result = this.requestApi('GetPrinterName', null);
		return result.statusCode === 0 ? result.resultInfo : '';
	}

	/**
	 * 判断当前打印机是否打开。
	 */
	public isPrinterOpened() {
		return this.requestApi('IsPrinterOpened', null).statusCode === 0;
	}

	/**
	 * 判断当前打印机是否在线
	 */
	public isPrinterOnline() {
		return this.requestApi('IsPrinterOnline', null).statusCode === 0;
	}

	/**
	 * 关闭当前使用的打印机
	 * 注意：关闭打印机时，当前还有未打印的任务/数据将会被自动提交打印，同时所有参数设置将会被保留。
	 */
	public closePrinter() {
		this.requestApi('ClosePrinter', null);
	}

	/**
	 * 显示打印机属性设置界面或者首选项设置界面。
	 * @param data
	 *      {
	 *          printerName,            // 打印机名称，如果为空则会显示当前打开的打印机设置界面。
	 *          showDocument            // 默认为TRUE，表示显示首选项设置界面；设为FALSE，显示打印机属性设置界面。
	 *      }
	 * @warning 如果在调用该接口前已通过 openPrinter 函数打开打印机，则可以不指定 printerName;
	 */
	public showProperty(data: any) {
		data = typeof data === 'object' ? data : {
			printerName: arguments[0],
			showDocument: arguments[1],
		};
		this.requestApi('ShowProperty', data);
	}

	/**
	 * 获取打印机列表；
	 * @param {object} data 参数列表；
	 *  {
	 *      onlyOnline,     // 是否只获取在线（已连接）的打印机；
	 *      onlySupported,  // 是否只获取支持的打印机？
	 *      onlyLocal,      // 是否仅返回本地打印机？
	 *  }
	 */
	public getPrinters(data: any): any {
		data = typeof data === 'object' ? data : {
			onlyOnline: arguments[0],
			onlySupported: arguments[1],
			onlyLocal: arguments[2],
		};
		return this.requestApi('GetPrinters', data).resultInfo;
	}

	/**
	 * 获取打印参数；
	 *
	 * @param {object} data 参数列表；
	 *      {
	 *          id         // 打印参数ID，ID值可参考 ParamID 属性；
	 *      }
	 * @return {number} 正常返回值应该大于等于0，返回值小于0表示失败；
	 */
	public getParam(data: any) {
		data = typeof data === 'object' ? data : { id: arguments[0] };
		return this.requestApi('GetParam', data).resultInfo;
	}

	/**
	 * 设置打印参数；
	 *
	 * @param {object} data 参数列表；
	 *      {
	 *          id,         // 打印机参数ID，ID值可参考 ParamID 属性；
	 *          value       // id值所对应打印机参数的value，具体可参考 ParamID；
	 *      }
	 * @return {boolean} 成功与否？
	 */
	public setParam(data: any) {
		data = typeof data === 'object' ? data : { id: arguments[0], value: arguments[1] };
		if (!(typeof data.id === 'string')) { return -1; }

		return this.requestApi('SetParam', data).statusCode === 0;
	}

	/**
	 * 获取已连接打印机的纸张类型；
	 * @return {number} 返回结果可以参考：GapType属性；
	 */
	public getGapType() {
		return this.getParam({ id: this.ParamID.gapType });
	}

	/**
	 * 修改已连接打印机的纸张类型；
	 * @param {data | number} data 纸张类型参数；
	 *      {
	 *          value       // 必须，纸张类型值；
	 *      }
	 * @return {boolean}
	 */
	public setGapType(data: any) {
		data = typeof data === 'object' ? data : { value: data };
		data.id = this.ParamID.gapType;
		return this.setParam(data);
	}

	/**
	 * 返回已连接打印机的打印浓度；
	 * @return {number} 打印机浓度值说明可参考 ParamID;
	 */
	public getPrintDarkness() {
		return this.getParam({ id: this.ParamID.printDarkness });
	}

	/**
	 * 修改已连接打印机的打印浓度；
	 * @param {data | number} data 打印浓度；
	 *      {
	 *          value       // 必须，打印浓度value值；
	 *      }
	 * @return {boolean}
	 */
	public setPrintDarkness(data: any) {
		data = typeof data === 'object' ? data : {
			value: data,
		};
		data.id = this.ParamID.printDarkness;
		return this.setParam(data);
	}

	/**
	 * 返回已连接打印机的打印速度；
	 * @return {number} 打印机速度值说明可参考 ParamID;
	 */
	public getPrintSpeed() {
		return this.getParam({ id: this.ParamID.printSpeed });
	}

	/**
	 * 修改已连接打印机的打印速度；
	 * @param {data | number} data 打印速度；
	 *      {
	 *          value       // 必须，打印速度value值；
	 *      }
	 * @return {boolean}
	 */
	public setPrintSpeed(data: any) {
		data = typeof data === 'object' ? data : {
			value: data,
		};
		data.id = this.ParamID.printSpeed;
		return this.setParam(data);
	}

	/**
	 * 设置默认字体名称；
	 */
	public setFontName(fontName: any) {
		this.fontName = typeof fontName === 'object' ? fontName.fontName : fontName;
	}

	/**
	 * 开始一打印任务.
	 * @param {object} data 参数列表；
	 *      打印任务相关参数：
	 *      {
	 *          width,          // 必填，标签纸宽度；
	 *          height,         // 可选，默认等同于width；
	 *          orientation,    // 可选，默认为0；value值为0/90/180/270；
	 *          jobName         // 可选，打印任务名称；
	 *      }
	 *  使用说明：开始打印任务时，如果没有打开打印机对象，则本函数会自动打开当前系统安装的第一个 LPAPI 支持的打印机，用于打印。
	 *  开始打印任务时，当前还有未打印的任务/数据将会被全部丢弃。
	 */
	public startJob(data: any) {
		data = typeof data === 'object' ? data : {
			width: arguments[0],
			height: arguments[1],
			orientation: arguments[2],
			jobName: arguments[3],
		};
		if (typeof data.width !== 'number' && !(data.width > 0)) { return false; }
		data.height = data.height || data.width;

		data.scaleUnit = 1;
		data.width *= 100;
		data.height *= 100;
		if (typeof data.gapLen === 'number') { data.gapLen *= 100; }
		data.jobName = data.jobName || 'WebAPI';

		return this.requestApi('StartJob', data).statusCode === 0;
	}

	/**
	 *  取消一打印任务
	 *  使用说明：当前还有未打印的任务/数据将会被全部丢弃，但是所有参数设置将会被保留。
	 */
	public abortJob() {
		this.requestApi('AbortJob', null);
	}

	/**
	 * 提交打印任务，进行真正的打印。
	 */
	public commitJob() {
		return this.requestApi('CommitJob', null).statusCode === 0;
	}

	/**
	 * 得到最近一次打印任务的标识。
	 * @return 打印任务标识。
	 */
	public getJobID() {
		return this.requestApi('GetJobID', null).resultInfo;
	}

	/**
	 * 得到打印任务的状态信息。
	 * @param data
	 *      {
	 *          printerName,        // 可选，打印机名称，为空表示当前打开的打印机。
	 *          jobID               // 可选，打印任务标识，为0表示最近一次的打印任务。
	 *      }
	 * @return 返回任务信息,格式为 JOB_INFO_1，为 NULL 用于测量需要的空间字节数。
	 */
	public getJobInfo(data: any) {
		data = typeof data === 'object' ? data : {
			printerName: arguments[0],
			jobID: arguments[1],
		};
		return this.requestApi('GetJobInfo', data).resultInfo;
	}

	/**
	 * 得到刚完成的打印任务的打印任务信息。
	 * @returns 返回刚完成的打印任务信息，格式如下：
	 *      {
	 *          width,      // 打印页面的宽度，单位像素；
	 *          height,     // 打印页面的高度，单位像素；
	 *          pages       // 打印页面总数；
	 *      }
	 */
	public getPageInfo() {
		return this.requestApi('GetPageInfo', null).resultInfo;
	}

	/**
	 * 得到刚完成的打印任务的页面图片数据。
	 * @param {Object} data
	 *      {
	 *          page,   // 可选，通过getPageInfo获取到的页面总数中的索引，默认为0，表示第一页；
	 *          format  // 可选，获取到的图片的数据格式，具体可参考 TargetImageFormat,默认为LPATIF_BASE64P_PNG,表示返回base64字符串；
	 *      }
	 * @returns 返回页面图片数据,数据格式：
	 *      {
	 *          page,       // 图片索引
	 *          format,     // 图片格式
	 *          data        // 图片数据
	 *      }
	 */
	public getPageImage(data: any) {
		data = typeof data === 'object' ? data : {
			page: arguments[0],
			format: arguments[1],
		};
		if (typeof data.format !== 'number') {
			data.format = this.TargetImageFormat.LPATIF_BASE64P_PNG;
		}

		const result = this.requestApi('GetPageImage', data);
		return result.statusCode === 0 ? result.resultInfo.data : '';
	}

	/**
	 * 开始一打印页面。
	 *  使用说明：如果之前没有调用 StartJob，则本函数会自动调用 StartJob，然后再开始一打印页面。此后调用 EndPage 结束打印时，打印任务会被自动提交打印。
	 *  页面旋转角度非 0 打印时，必须在打印动作之前设置打印页面尺寸信息。
	 */
	public startPage() {
		return this.requestApi('StartPage', null).statusCode === 0;
	}

	/**
	 * 结束一打印页面。
	 *  使用注意：如果之前没有调用 StartJob 而直接调用 StartPage，则本函数会自动提交打印。
	 */
	public endPage() {
		return this.requestApi('EndPage', null).statusCode === 0;
	}

	/**
	 * Win10下如果字体为粗体或者斜体，会显示乱码的问题，所以在drawText的时候需要进行些处理；
	 */
	public isWin10() {
		return navigator.userAgent.match(/windows\s*nt\s*(10\.[0-9]+)/i);
	}

	/**
	 * Win10下如果字体为粗体或者斜体，会显示乱码的问题，所以在drawText的时候需要进行些处理；
	 */
	public isWin8() {
		return navigator.userAgent.match(/windows\s*nt\s*(6\.[2-3]+)/i);
	}

	/*********************************************************************
	 * 绘制相关内容。
	 *********************************************************************/
	/**
	 * 打印文本字符串
	 *
	 * @param {object} data 打印字符串相关参数列表；
	 *   {
	 *       text,       // 必填，字符串类型的打印数据；
	 *       x,          // 可选，打印矩形框水平位置（单位毫米(mm)），默认为0；
	 *       y,          // 可选，打印矩形框垂直位置（单位毫米(mm)），默认为0；
	 *       width,      // 可选，打印矩形框水平宽度（单位毫米(mm)），默认为0，表示为本显示宽度；
	 *       height,     // 可选，打印矩形框垂直高度（单位毫米(mm)），默认为0，表示文本的显示高度；
	 *       fontHeight, // 必填，字体高度；
	 *       fontStyle   // 可选，字体样式；
	 *                   // 0：一般； 1：粗体； 2：斜体；3：粗斜体；4：下划线；8：删除线。
	 *       fontName,   // 可选，字体名称，默认为黑体；
	 *   }
	 */
	public drawText(data: any) {
		data = typeof data === 'object' ? data : {
			text: arguments[0],
			x: arguments[1],
			y: arguments[2],
			width: arguments[3],
			height: arguments[4],
			fontHeight: arguments[5],
			fontStyle: arguments[6],
			fontName: arguments[7],
		};
		if (data.text == null) { return; }

		data.x = (data.x || 0) * 100;
		data.y = (data.y || 0) * 100;
		data.width = (data.width || 0) * 100;
		data.height = (data.height || 0) * 100;
		data.fontHeight = (data.fontHeight || 0) * 100;
		data.fontStyle = (data.fontStyle && !this.isWin8() && !this.isWin10()) ? data.fontStyle : 0;
		data.fontName = data.fontName || this.fontName;

		this.requestApi('DrawText', data);
	}

	/**
	 * 打印一维条码。
	 * @param {object} data 打印一维码时需提供的一维码相关参数列表；
	 *
	 *   {
	 *       text,           // 必填，一维码内容字符串；
	 *       x,              // 可选，打印一维码水平位置（单位毫米(mm)），默认为0；
	 *       y,              // 可选，打印一维码垂直位置（单位毫米(mm)），默认为0；
	 *       width,          // 必填，打印一维码水平宽度（单位毫米(mm)）；
	 *       height,         // 可选，打印一维码水平宽度，默认等同于width
	 *       textHeight      // 可选，一维码中显示的字符信息高度，默认为0；
	 *       type,           // 可选，一维码类型，默认根据字符串自动采用最佳方式；
	 *   }
	 */
	public draw1DBarcode(data: any) {
		data = typeof data === 'object' ? data : {
			text: arguments[0],
			x: arguments[1],
			y: arguments[2],
			width: arguments[3],
			height: arguments[4],
			textHeight: arguments[5],
			type: arguments[6],
		};
		if (data.text == null) { return; }

		data.x = (data.x || 0) * 100;
		data.y = (data.y || 0) * 100;
		data.width = (data.width || 0) * 100;
		data.height = data.height ? data.height * 100 : data.width;
		data.textHeight = (data.textHeight || 0) * 100;

		this.requestApi('Draw1DBarcode', data);
	}

	/**
	 * 打印 QrCode 二维码。
	 * @param {object} data 打印二维码需提供的打印参数列表；
	 *      {
	 *          text,       // 必填，打印内容；
	 *          x,          // 可选，打印起始位置，默认为左上角；
	 *          y,          // 可选，打印起始位置，默认为左上角；
	 *          width,      // 必填，二维码宽度；
	 *          height,     // 可选，二维码高度，默认等同于width
	 *      }
	 */
	public draw2DQRCode(data: any) {
		data = typeof data === 'object' ? data : {
			text: arguments[0],
			x: arguments[1],
			y: arguments[2],
			width: arguments[3],
			height: arguments[4],
		};
		if (data.text == null) { return; }

		data.x = (data.x || 0) * 100;
		data.y = (data.y || 0) * 100;
		data.width = (data.width || 0) * 100;
		data.height = data.height ? data.height * 100 : data.width;

		this.requestApi('Draw2DQRCode', data);
	}

	/**
	 * 打印 Pdf417 二维码。
	 * @param {object} data 打印PDF417所需打印参数列表；
	 *      {
	 *          text,       // 必填，二维码内容；
	 *          x,          // 可选，默认为打印区域的左上角；
	 *          y,          // 可选，默认为打印区域的左上角；
	 *          width,      // 必填，二维码宽度；
	 *          height,     // 可选，二维码高度，默认等同于width
	 *      }
	 */
	public draw2DPdf417(data: any) {
		data = typeof data === 'object' ? data : {
			text: arguments[0],
			x: arguments[1],
			y: arguments[2],
			width: arguments[3],
			height: arguments[4],
		};
		if (data.text == null) { return; }

		data.x = (data.x || 0) * 100;
		data.y = (data.y || 0) * 100;
		data.width = (data.width || 0) * 100;
		data.height = data.height ? data.height * 100 : data.width;

		this.requestApi('Draw2DPdf417', data);
	}

	/**
	 * 以指定的线宽，打印矩形框。
	 * @param {object} data 矩形框打印参数列表；
	 *      {
	 *          x,          // 可选，矩形框起始位置，默认为打印区域的左上角；
	 *          y,          // 可选，矩形框起始位置，默认为打印区域的左上角；
	 *          width,      // 必填，矩形框宽度；
	 *          height,     // 可选，矩形框高度，默认等同于width
	 *          lineWidth,  // 可选，矩形框线宽；
	 *      }
	 */
	public drawRectangle(data: any) {
		data = typeof data === 'object' ? data : {
			x: arguments[0],
			y: arguments[1],
			width: arguments[2],
			height: arguments[3],
			lineWidth: arguments[4],
		};

		data.x = (data.x || 0) * 100;
		data.y = (data.y || 0) * 100;
		data.width = (data.width || 0) * 100;
		data.height = data.height ? data.height * 100 : data.width;
		data.lineWidth = (data.lineWidth || defaultLineWidth) * 100;

		this.requestApi('DrawRectangle', data);
	}

	/**
	 * 打印填充的矩形框。
	 *
	 * @param {object} data 填充矩形打印参数列表；
	 *      {
	 *          x,          // 可选，矩形的起始位置，默认为左上角；
	 *          y,          // 可选，矩形的起始位置，默认为左上角；
	 *          width,      // 必填，矩形宽度；
	 *          height,     // 可选，矩形高度，默认等同于width
	 *      }
	 */
	public fillRectangle(data: any) {
		data = typeof data === 'object' ? data : {
			x: arguments[0],
			y: arguments[1],
			width: arguments[2],
			height: arguments[3],
		};
		data.x = (data.x || 0) * 100;
		data.y = (data.y || 0) * 100;
		data.width = (data.width || 0) * 100;
		data.height = data.height ? data.height * 100 : data.width;

		this.requestApi('FillRectangle', data);
	}

	/**
	 * 以指定的线宽，打印圆角矩形框
	 *
	 * @param {object} data 打印圆角矩形时所需要提供的参数列表；
	 *      {
	 *           x,              // 可选，打印椭圆矩形框水平位置
	 *           y,              // 可选，打印椭圆矩形框垂直位置
	 *           width,          // 必填，打印椭圆矩形框水平宽度
	 *           height,         // 可选，打印椭圆矩形框垂直高度，默认等同于width
	 *           cornerWidth,    // 可选，圆角宽度
	 *           cornerHeight    // 可选，圆角高度
	 *           lineWidth       // 可选，矩形的线宽
	 *       }
	 */
	public drawRoundRectangle(data: any) {
		data = typeof data === 'object' ? data : {
			x: arguments[0],
			y: arguments[1],
			width: arguments[2],
			height: arguments[3],
			cornerWidth: arguments[4],
			cornerHeight: arguments[5],
			lineWidth: arguments[6],
		};
		data.x = (data.x || 0) * 100;
		data.y = (data.y || 0) * 100;
		data.width = (data.width || 0) * 100;
		data.height = data.height ? data.height * 100 : data.width;
		data.cornerWidth = (typeof data.cornerWidth === 'number' ? data.cornerWidth : defaultCornerRadius) * 100;
		data.cornerHeight = typeof data.cornerHeight === 'number' ? data.cornerHeight * 100 : data.cornerWidth;
		data.lineWidth = (data.lineWidth || defaultLineWidth) * 100;

		this.requestApi('DrawRoundRectangle', data);
	}

	/**
	 * 打印填充的圆角矩形框
	 * @param {object} data 打印填充矩形时所需要提供的参数列表；
	 *      {
	 *           x,              // 必填，打印椭圆矩形框水平位置
	 *           y,              // 必填，打印椭圆矩形框垂直位置
	 *           width,          // 必填，打印椭圆矩形框水平宽度
	 *           height,         // 可选，打印椭圆矩形框垂直高度，默认等同于width
	 *           cornerWidth,    // 可选，圆角宽度
	 *           cornerHeight    // 可选，圆角高度
	 *       }
	 */
	public fillRoundRectangle(data: any) {
		data = typeof data === 'object' ? data : {
			x: arguments[0],
			y: arguments[1],
			width: arguments[2],
			height: arguments[3],
			cornerWidth: arguments[4],
			cornerHeight: arguments[5],
		};
		data.x = (data.x || 0) * 100;
		data.y = (data.y || 0) * 100;
		data.width = (data.width || 0) * 100;
		data.height = data.height ? data.height * 100 : data.width;
		data.cornerWidth = (typeof data.cornerWidth === 'number' ? data.cornerWidth : defaultCornerRadius) * 100;
		data.cornerHeight = typeof data.cornerHeight === 'number' ? data.cornerHeight * 100 : data.cornerWidth;

		this.requestApi('FillRoundRectangle', data);
	}

	/**
	 * 以指定的线宽，打印椭圆
	 * @param {object} data 椭圆打印相关参数列表；
	 *      {
	 *          x,          // 必填，打印椭圆矩形框水平位置
	 *          y,          // 必填，打印椭圆矩形框垂直位置
	 *          width,      // 必填，打印椭圆矩形框水平宽度
	 *          height,     // 可选，打印椭圆矩形框垂直高度，默认等同于width
	 *          lineWidth   // 可选，椭圆的线宽
	 *      }
	 */
	public drawEllipse(data: any) {
		data = typeof data === 'object' ? data : {
			x: arguments[0],
			y: arguments[1],
			width: arguments[2],
			height: arguments[3],
			lineWidth: arguments[4],
		};
		data.x = (data.x || 0) * 100;
		data.y = (data.y || 0) * 100;
		data.width = (data.width || 0) * 100;
		data.height = data.height ? data.height * 100 : data.width;
		data.lineWidth = (data.lineWidth || defaultLineWidth) * 100;

		this.requestApi('DrawEllipse', data);
	}

	/**
	 * 打印填充的椭圆
	 * @param {object} data 打印填充椭圆时所需要提供的参数列表；
	 *      {
	 *          x,          // 必填，打印椭圆矩形框水平位置
	 *          y,          // 必填，打印椭圆矩形框垂直位置
	 *          width,      // 必填，打印椭圆矩形框水平宽度
	 *          height,     // 可选，打印椭圆矩形框垂直高度，默认等同于width
	 *      }
	 */
	public fillEllipse(data: any) {
		data = typeof data === 'object' ? data : {
			x: arguments[0],
			y: arguments[1],
			width: arguments[2],
			height: arguments[3],
		};
		data.x = (data.x || 0) * 100;
		data.y = (data.y || 0) * 100;
		data.width = (data.width || 0) * 100;
		data.height = data.height ? data.height * 100 : data.width;

		this.requestApi('FillEllipse', data);
	}

	/**
	 *  打印线（直线/斜线）
	 * @param {object} data 打印直线所需参数列表：
	 *      {
	 *          x1,         // 必填，线的起点
	 *          y1,         // 必填，线的起点
	 *          x2,         // 必填，线的终点
	 *          y2,         // 必填，线的终点
	 *          lineWidth,  // 可选，线条的宽度；
	 *      }
	 */
	public drawLine(data: any) {
		data = typeof data === 'object' ? data : {
			x1: arguments[0],
			y1: arguments[1],
			x2: arguments[2],
			y2: arguments[3],
			lineWidth: arguments[4],
		};
		data.x1 = (data.x1 || 0) * 100;
		data.y1 = (data.y1 || 0) * 100;
		data.x2 = (data.x2 || 0) * 100;
		data.y2 = (data.y2 || 0) * 100;
		data.lineWidth = (data.lineWidth || defaultLineWidth) * 100;

		this.requestApi('DrawLine', data);
	}

	/**
	 *  打印点划线
	 * @param {object} data 打印点画线的时候需要提供的参数列表；
	 *      {
	 *          x1,             // 必填，线的起点
	 *          y1,             // 必填，线的起点
	 *          x2,             // 必填，线的终点
	 *          y2,             // 必填，线的终点
	 *          lineWidth,      // 可选，点画线线条的宽度,如果未指定，则采用默认线条宽度；
	 *          dashLen,        // 可选，number类型的数组；
	 *          dashLen1,       // 可选，点画线中第一段线的长度,默认为0.25；
	 *          dashLen2,       // 可选，点画线中第二段线的长度,默认等同于dashLen1;
	 *          dashLen3,       // 可选，点画线中第三段线的长度,默认等同于dashLen1;
	 *          dashLen4,       // 可选，点画线中第四段线的长度,默认等同于dashLen2;
	 *      }
	 */
	public drawDashLine(data: any) {
		if (typeof data !== 'object') {
			data = {
				x1: arguments[0],
				y1: arguments[1],
				x2: arguments[2],
				y2: arguments[3],
				lineWidth: arguments[4],
			};
			if (arguments[5] && arguments[5] instanceof Array) {
				data.dashLen = arguments[5];
			} else {
				data.dashLen1 = arguments[5];
				data.dashLen2 = arguments[6];
				data.dashLen3 = arguments[7];
				data.dashLen4 = arguments[8];
			}
		}

		data.x1 = (data.x1 || 0) * 100;
		data.y1 = (data.y1 || 0) * 100;
		data.x2 = (data.x2 || 0) * 100;
		data.y2 = (data.y2 || 0) * 100;
		data.lineWidth = typeof data.lineWidth === 'number' ? data.lineWidth * 100 : defaultLineWidth * 100;

		if (data.dashLen instanceof Array) {
			for (let i = 0; i < data.dashLen.length; i++) {
				data.dashLen[i] = data.dashLen[i] * 100;
			}
			data.dashLen = data.dashLen.join(',');
		} else {
			data.dashLen1 = typeof data.dashLen1 === 'number' ? data.dashLen1 * 100 : 25;
			data.dashLen2 = typeof data.dashLen2 === 'number' ? data.dashLen2 * 100 : data.dashLen1;
			data.dashLen3 = typeof data.dashLen3 === 'number' ? data.dashLen3 * 100 : data.dashLen1;
			data.dashLen4 = typeof data.dashLen4 === 'number' ? data.dashLen4 * 100 : data.dashLen2;
		}

		this.requestApi('DrawDashLine', data);
	}

	/**
	 *  打印指定文件的图片
	 * @param {object} data 打印图片的时候需要提供的参数列表；
	 *      {
	 *          imageFile,          // 必填，图片url路径，或者base64字符串格式图片；
	 *          x,                  // 可选，打印位图水平位置（单位毫米(mm)）
	 *          y,                  // 可选，打印位图垂直位置（单位毫米(mm)）
	 *          width,              // 可选，打印位图水平宽度（单位毫米(mm)）。默认为 0，则采用加载的位图的宽度
	 *          height,             // 可选，打印位图垂直高度（单位毫米(mm)）。默认为 0，则采用加载的位图的高度
	 *          threshold           // 可选，黑白打印的灰度阀值，默认为192；0 表示使用参数设置中的值；256 表示取消黑白打印，用灰度打印；257 表示直接打印图片原来的颜色
	 *      }
	 * @使用注意：
	 *       如果之前没有调用 StartPage 而直接进行打印，则打印函数会自动调用 StartPage开始一打印页面，然后进行打印。
	 *       打印位置和宽度高度是基于当前页面的位置和方向，不考虑页面和打印动作的旋转角度。
	 *       图片打印时会被缩放到指定的宽度和高度。
	 *       标签打印都是黑白打印，因此位图会被转变成灰度图片（RGB三分量相同，0～255取值的颜色）之后，然后根据一阀值将位图再次转换黑白位图再进行打印。默认灰度阀值为 192，也就是说 >= 192 的会被认为是白色，而 < 192 的会被认为是黑色。
	 */
	public drawImage(data: any) {
		data = typeof data === 'object' ? data : {
			imageFile: arguments[0],
			x: arguments[1],
			y: arguments[2],
			width: arguments[3],
			height: arguments[4],
			threshold: arguments[5],
		};
		if (data.imageFile == null) { return; }

		data.x = (data.x || 0) * 100;
		data.y = (data.y || 0) * 100;
		data.width = (data.width || 0) * 100;
		data.height = (data.height || 0) * 100;
		data.threshold = typeof data.threshold === 'number' ? data.threshold : 192;

		this.requestApi('DrawImage', data);
	}

	/**
	 * 绘制位图对象；
	 * @param {object} data 所要绘制的位图的相关参数；
	 *      {
	 *          data,               // 必填，位图对象, 一般可base64字符串表示；
	 *          format,             // 可选，data中的位图格式，不指定则表示base64字符串；
	 *          imageWidth，        // 可选，data中图片的实际宽度；
	 *          x,                  // 可选，打印位图水平位置（单位毫米(mm)）
	 *          y,                  // 可选，打印位图垂直位置（单位毫米(mm)）
	 *          drawWidth,          // 可选，打印位图水平宽度（单位毫米(mm)）。默认为 0，则采用加载的位图的宽度
	 *          drawHeight,         // 可选，打印位图垂直高度（单位毫米(mm)）。默认为 0，则采用加载的位图的高度
	 *          lineSize,           // 可选，位图数据每一行数据的字节数。如果为零，则采用如下的默认长度；如果指定 lineSize，则必须 >= 默认长度。
	 *                              //      LPASIF_BPP_1   : (width + 7) / 8
	 *                              //      LPASIF_BPP_1N  : (width + 7) / 8
	 *                              //      LPASIF_32_RGBA : width * 4
	 *                              //      LPASIF_32_BGRA : width * 4
	 *                              //      LPASIF_32_RGB  : width * 4
	 *                              //      LPASIF_32_BGR  : width * 4
	 *                              //      LPASIF_PACKAGE : 报文格式未使用 lineSize 参数。
	 *          threshold           // 可选，黑白打印的灰度阀值，默认为192；0 表示使用参数设置中的值；256 表示取消黑白打印，用灰度打印；257 表示直接打印图片原来的颜色
	 *      }
	 */
	public drawImageD(data: any) {
		data = typeof data === 'object' ? data : {
			data: arguments[0],
			format: arguments[1],
			imageWidth: arguments[2],
			x: arguments[3],
			y: arguments[4],
			drawWidth: arguments[5],
			drawHeight: arguments[6],
			lineSize: arguments[7],
			threshold: arguments[8],
		};
		this.requestApi('DrawImageD', data);
	}

	/**
	 * 直接打印打印机所支持的控制命令数据，可以是打印数据，也可以是参数设置命令等。
	 * @param data
	 *      {
	 *          data,           // 必填，位图对象数据，具体格式由 format 参数指定。
	 *          printerName,    // 可选，打印机名称，默认表示上次连接过的打印机；
	 *          copies,         // 可选，打印份数，默认为1；
	 *          jobName         // 可选，打印任务名称；
	 *      }
	 */
	public printRawData(data: any) {
		data = typeof data === 'object' ? data : {
			data: arguments[0],
			printerName: arguments[1],
			copies: arguments[2],
			jobName: arguments[3],
		};
		this.requestApi('PrintRawData', data);
	}

	/**
	 * 直接打印 LPASIF_PACKAGE 格式的图片数据。
	 * @param data
	 *      {
	 *          data,           // 必填，LPASIF_PACKAGE 格式的位图对象原始二进制数据。
	 *          width,          // 必填，打印位图水平宽度，单位是像素。
	 *          printerName,    // 可选，打印机名称，默认表示上次连接过的打印机；
	 *          copies,         // 可选，打印份数，默认为1；
	 *          jobName         // 可选，打印任务名称；
	 *      }
	 */
	public printPackage(data: any) {
		data = typeof data === 'object' ? data : {
			data: arguments[0],
			width: arguments[1],
			printerName: arguments[2],
			copies: arguments[3],
			jobName: arguments[4],
		};
		this.requestApi('PrintPackage', data);
	}

	/**
	 * 直接打印指定位图对象。
	 * @param data 相关打印参数，参数描述如下：
	 *      {
	 *          data,           // 必填，打印数据，一般指定base64格式字符串即可；
	 *          printerName,    // 可选，打印机名称，不指定表示上次连接过的打印机；
	 *          format,         // 可选，data中传递的打印数据格式，不指定表示base64字符串；
	 *          imageWidth,     // 可选，如果以二进制流的方式传递打印数据，则需要制定对应图片的宽度，单位像素；
	 *          lineSize,       // 可选，
	 *          printWidth,     // 可选，打印区域宽度，单位根据scaleUnit来确定，
	 *          printHeight,    // 可选，打印区域高度，单位根据scaleUnit来确定，
	 *          scaleUnit,      // 可选，
	 *          threshold,      // 可选，图片黑白转换的阀值；
	 *          orientation,    // 可选，打印任务的旋转角度，默认为0；
	 *          copies,         // 可选，打印份数，默认为1；
	 *          jobName         // 可选，打印任务名称
	 *      }
	 */
	public printImage(data: any) {
		data = typeof data === 'object' ? data : {
			data: arguments[0],
			printerName: arguments[1],
			format: arguments[2],
			imageWidth: arguments[3],
			lineSize: arguments[4],
			printWidth: arguments[5],
			printHeight: arguments[6],
			scaleUnit: arguments[7],
			threshold: arguments[8],
			orientation: arguments[9],
			copies: arguments[10],
			jobName: arguments[11],
		};
		this.requestApi('PrintImageD', data);
	}

	/**
	 * 请求web服务器；
	 * @param action action 请求方法；
	 * @param data data 请求参数;
	 */
	private requestApi(action: string, data?: any): any {
		if (console) {
			console.log(action);
			console.log(data);
		}
		let result;
		// 请求URL；
		let url = getUrl(this.ipAddress, action);
		// data中的data属性一般表示一些二进制的大数据，或者进行了base64编码后的字符串；
		const blob = data ? data.data : null;
		if (blob) { delete data.data; }
		// 请求参数；
		const str = getParamString(data);
		// 为了避免出现提交任务后其他任务未提交的问题，再进行http请求的时候，需要进行同步请求；
		url += (str.length > 0 ? ('?' + str) : '');

		// XMLHttpRequest 所支持的浏览器有：IE7+, Firefox, Chrome, Opera, Safari 浏览器执行代码；
		// ActiveXObject  所支持的浏览器有：IE6, IE5
		// eslint-disable-next-line no-undef
		const xmlhttp = XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
		// 请求结果处理函数；
		xmlhttp.onreadystatechange = () => {
			// readyState == 4表示响应内容加载完毕；
			if (xmlhttp.readyState === 4) {
				if (xmlhttp.status === 200) {
					// 请求成功；
					// eslint-disable-next-line no-eval
					result = JSON.parse(xmlhttp.responseText);
				} else {
					// 请求失败；
					result = xmlhttp.responseText;
				}
			}
		};

		try {
			// 如果blob为一个数组(二进制流)，则需要先对blob进行压缩处理，然后进行base64编码；
			// TODO: 调用压缩方法，进行压缩处理；
			// TODO：base64编码
			if (this.type === 'GET') {
				if (typeof blob === 'string') {
					url = appendUrl(url, 'data', blob);
				}
				xmlhttp.open(this.type, url, false);
				xmlhttp.send();
			} else {
				xmlhttp.open(this.type, url, false);
				if (typeof blob === 'string') {
					xmlhttp.setRequestHeader('Content-type', 'application/octet-stream;encoding=base64');
					xmlhttp.send(blob);
				} else {
					xmlhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
					xmlhttp.send(str);
				}
			}
		} catch (e) {
			alert('http请求失败，请检查打印机服务是否开启！');
		}
		if (console) {
			console.log(result);
		}

		return result;
	}
}

export default WebAPI;
