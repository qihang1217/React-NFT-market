export function delete_padding() {
	//清除外部的边界框
	const parent = document.querySelector('.ant-layout-content')
	parent.style.setProperty("padding", '0px', 'important');
	const insideParent = document.querySelector('.site-layout-content')
	insideParent.style.setProperty("padding", '0px', 'important');
}

export function revive_padding() {
	//清除外部的边界框
	const parent = document.querySelector('.ant-layout-content')
	parent.style.setProperty("padding", '0px 50px');
	const insideParent = document.querySelector('.site-layout-content')
	insideParent.style.setProperty("padding", '24px');
}