import { useState } from 'react';

export type ToastType = 'success' | 'error' | 'info' | 'loading';

type ToastItem = {
	id: number;
	type: ToastType;
	message: string;
	duration?: number;
};

const EMOJI: Record<ToastType, string> = {
	success: '✅',
	error: '❌',
	info: 'ℹ️',
	loading: '⌛',
};

const MAX_TOASTS = 3;

export const useToast = () => {
	const [toasts, setToasts] = useState<ToastItem[]>([]);

	const dismiss = (id: number) => {
		setToasts((prev) => prev.filter((t) => t.id !== id));
	};

	const show = (
		type: ToastType,
		message: string,
		duration = type === 'loading' ? undefined : 2500
	) => {
		const id = Date.now();

		setToasts((prev) => {
			const next = [
				...prev,
				{ id, type, message: `${EMOJI[type]} ${message}`, duration },
			];

			// 🧪 limit max visible toasts
			return next.slice(-MAX_TOASTS);
		});

		// ⌛ auto-dismiss (except loading)
		if (duration) {
			setTimeout(() => dismiss(id), duration);
		}

		return id; // useful for manually dismissing loading toasts
	};

	return { toasts, show, dismiss };
};

export const Toast = ({
	toasts,
	onDismiss,
}: {
	toasts: ToastItem[];
	onDismiss: (id: number) => void;
}) => (
	<div className="toast toast-bottom toast-end z-50 space-y-2">
		{toasts.map((toast) => (
			<div
				key={toast.id}
				onClick={() => onDismiss(toast.id)}
				className={`alert animate-toast-in cursor-pointer transition-all duration-300 ease-out ${
					toast.type === 'success'
						? 'alert-success'
						: toast.type === 'error'
							? 'alert-error'
							: toast.type === 'loading'
								? 'alert-info'
								: 'alert-info'
				}`}>
				<div className="flex items-center gap-2">
					{toast.type === 'loading' && (
						<span className="loading loading-spinner loading-sm" />
					)}
					<span>{toast.message}</span>
				</div>
			</div>
		))}
	</div>
);
