import React from "react";
import { Link } from "react-router-dom";
import { dashboardRoute } from "../../../routes";
import "./styles.scss";

export default function Nav() {
	return (
		<div className="Nav">
			<div className="navigation">
				<Link className="navLink" to={dashboardRoute}>
					Dashboard
				</Link>
			</div>
		</div>
	);
}
