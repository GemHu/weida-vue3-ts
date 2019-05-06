class Size {
	public width = 0;
	public height = 0;

	constructor();
	constructor(width: number, height: number);
	constructor(width?: number, height?: number) {
		this.width = width || 0;
		this.height = height || 0;
	}
}

export default Size;
