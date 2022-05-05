import React from "react";
import FileViewer from 'react-file-viewer';

export const setPreview = (item, filename, ext, filetype, src) => {
	let previewContent = (
		<FileViewer
			fileType={ext}
			filePath={src}
		/>
	)
	if (/^image\/\S+$/.test(filetype)) {
		previewContent = (<img src={src} alt={filename} className='file'/>)
	} else if (/^video\/\S+$/.test(filetype)) {
		previewContent = (<video src={src} loop preload className='file'/>)
	} else if (/^audio\/\S+$/.test(filetype)) {
		previewContent = (
			<audio preload className='file'>
				<source src={src}/>
				<embed src={src}/>
			</audio>
		)
	}
	return previewContent
}