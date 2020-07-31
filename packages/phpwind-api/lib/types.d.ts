export interface IPHPWindTaskRow {
    task_id: string;
    task_name: string;
    task_desc: string;
    task_credit: string;
}
export interface IPHPWindTaskRowDoing extends IPHPWindTaskRow {
    task_percent?: string;
    task_drawable: boolean;
}
export interface IPHPWindTaskList {
    /**
     * 無法接取的任務
     */
    disallow: IPHPWindTaskRow[];
    /**
     * 可以接取的任務
     */
    allow: IPHPWindTaskRow[];
    /**
     * 进行中的任务
     */
    doing?: IPHPWindTaskRowDoing[];
}
