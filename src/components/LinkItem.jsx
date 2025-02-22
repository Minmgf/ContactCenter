import Link from "next/link";
import React from "react";

const LinkItem = ({href, name, className}) => {
    return <Link href={`/${href}`} className={`${className}`}>{name}</Link>;
};

export default LinkItem;
