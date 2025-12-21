'use client'

import {
	AlertDialog,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { confirmable, createConfirmation, type ConfirmDialogProps } from 'react-confirm';
import { Button, buttonVariants } from "@/components/ui/button";
import type { ReactNode } from 'react';
import { VariantProps } from "class-variance-authority";

const ConfirmDialog = ({
	show,
	proceed,
	title,
	message,
	buttonMessage,
	buttonVariant = 'default'
}: ConfirmDialogProps<{ title: ReactNode; message: ReactNode, buttonMessage?: ReactNode, buttonVariant?: VariantProps<typeof buttonVariants>["variant"] }, boolean>) => (
	<AlertDialog open={show}>
		<AlertDialogContent>
			<AlertDialogHeader>
				<AlertDialogTitle>{title}</AlertDialogTitle>
				<div className="text-muted-foreground text-sm">{message}</div>
			</AlertDialogHeader>
			<AlertDialogFooter>
				<AlertDialogCancel
					onClick={() => {
						proceed(false);
					}}
				>
					Cancel
				</AlertDialogCancel>
				<Button
					variant={buttonVariant}
					onClick={() => {
						proceed(true);
					}}
				>
					{buttonMessage || 'Confirm'}
				</Button>
			</AlertDialogFooter>
		</AlertDialogContent>
	</AlertDialog>
);

export const confirm = createConfirmation(confirmable(ConfirmDialog));