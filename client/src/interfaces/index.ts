export interface Image extends File {}

export interface Video extends File {}

export interface File {
	path: string;
	name: string;
	size: number;
	extension: string;
	type: ItemType.FILE;
}

export interface Folder {
	path: string;
	name: string;
	children: Array<Folder | File>;
	size: number;
	type: ItemType.DIRECTORY;
}

export enum ItemType {
	DIRECTORY = 'directory',
	FILE = 'file'
}
