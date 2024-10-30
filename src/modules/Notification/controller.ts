import { NextFunction, Request, Response } from 'express';
import { postNotification, getNotification } from './service';
import { AppError } from '@/utils';
import { Store } from '@/models';

export const postNotificationController = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { storeId } = req.body;
		if (!storeId)
			throw new AppError('알림 송신을 위한 가게ID가 누락되었습니다', 400);

		const store = await Store.findOne({ _id: storeId });

		if (store === null) throw new AppError('존재하지 않는 가게입니다', 404);

		const Notification = await postNotification(storeId);
		res.status(201).json({
			msg: 'ok',
			Notification,
		});
	} catch (error) {
		next(error);
	}
};

export const getNotificationController = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const user = req.user;
		if (!user) {
			throw new AppError(
				'사용자 인증 정보가 없습니다. 잘못된 접근입니다.',
				401,
			);
		}
		const notification = await getNotification(user._id);
		res.status(200).json({
			msg: 'ok',
			notification,
		});
	} catch (error) {
		next(error);
	}
};
