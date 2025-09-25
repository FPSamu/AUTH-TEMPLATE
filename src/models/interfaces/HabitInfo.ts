import { ObjectId } from 'mongodb';
import { HabitType } from '../Habit';
import Rules from './Rules';

export default interface HabitInfo {
    habit_id: ObjectId;
    name: string;
    type: HabitType;
    rules?: Rules;
    done: boolean;
    times_left?: number;
    time_left?: number;
}