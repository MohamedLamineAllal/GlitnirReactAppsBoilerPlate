import React from "react";
import { Link } from "react-router-dom";
import { tradingViewRoute } from "../../../routes";
import "./styles.scss";

export default function Nav() {
	return (
		<div className="Nav">
			<div className="navigation">
				<Link className="navLink" to={tradingViewRoute}>
					Gold script
				</Link>
			</div>
		</div>
	);
}
