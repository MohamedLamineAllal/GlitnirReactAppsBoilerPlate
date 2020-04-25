import React, { ReactPropTypes, Props } from "react";
import Header from "../Main/Header";

export default function MainLayout({ children }: React.Props<{}>) {
	return (
		<div className="MainLayout">
			<Header />
			{children}
		</div>
	);
}
