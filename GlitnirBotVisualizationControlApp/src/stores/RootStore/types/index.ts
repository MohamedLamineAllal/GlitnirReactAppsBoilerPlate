//___________________users list
type UserRole = string | ('SUPER_ADMIN' | 'NORMAL_USER');

export interface User {
    id: number,
    username: string,
    firstName: string,
    middleName: string,
    lastName: string,
    sex: 'Male' | 'Female',
    role: UserRole,
    created_at: number,
    updated_at: number
}

export interface Users {
    [userId: string]: User 
}


//___________________processes List
export interface Process {
    id?: string | number,
    userId: string | number,
    name: string,
    description?: string,
    state: 'Running' | 'Stopped',
    create_at?: number,
    updated_at?: Date
}

export interface Processes {
    [processId: string]: Process
}

type ProcessId = number;

//____ users processes relationship
export interface UsersProcesses {
    [userId: string]: ProcessId[] 
}