import React from "react";
import FileViewer from 'react-file-viewer';
import ModelViewer from "../components/ModelViewer/ModelViewer";

export const setPreview = (item, filename, ext, filetype, src) => {
	let previewContent = (
		<FileViewer
			fileType={ext}
			filePath={src}
		/>
	)
	if (filetype === 'image') {
		previewContent = (<img src={src} alt={filename} className='file'/>)
	} else if (filetype === 'video') {
		previewContent = (<video src={src} loop preload className='file'/>)
	} else if (filetype === 'audio') {
		previewContent = (
			<audio preload className='file'>
				<source src={src}/>
				<embed src={src}/>
			</audio>
		)
	} else if (filetype === 'model') {
		previewContent = (
			<ModelViewer
				src={src}
			/>
		)
	}
	return previewContent
}

export const setControlsPreview = (item, filename, ext, filetype, src) => {
	let previewContent = (
		<FileViewer
			fileType={ext}
			filePath={src}
		/>
	)
	if (filetype === 'image') {
		previewContent = (<img src={src} alt={filename} className='file'/>)
	} else if (filetype === 'video') {
		previewContent = (<video src={src} loop preload='true' controls className='file'/>)
	} else if (filetype === 'audio') {
		previewContent = (
			<audio controls preload='true' className='file'>
				<source src={src}/>
				<embed src={src}/>
			</audio>
		)
	} else if (filetype === 'model') {
		previewContent = (
			<ModelViewer
				src={src}
			/>
		)
	}
	return previewContent
}