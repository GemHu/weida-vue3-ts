import Rect from '../common/Rect';

class Base extends Rect {
	public rotation: number = 0;

	public clone(copy?: Base): Base {
		copy = copy || new Base();
		super.clone(copy);
		//
		copy.rotation = this.rotation;
		return copy;
	}
}

export default Base;
