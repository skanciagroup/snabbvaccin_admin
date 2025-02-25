import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import Link from "next/link";

interface BreadcrumbBlockProps {
  breadcrumbs: {
    label: string;
    href: string;
  }[];
}

const BreadcrumbBlock: React.FC<BreadcrumbBlockProps> = ({ breadcrumbs }) => {
  return (
    <div className="mt-2">
      <Breadcrumb>
        <BreadcrumbList>
          {breadcrumbs.map((item, index) => (
            <BreadcrumbItem key={index}>
              {index < breadcrumbs.length - 1 ? (
                <Link className="text-primary hover:text-primaryDark" href={item.href}>{item.label}</Link>
              ) : (
                <BreadcrumbPage className="text-secondary">{item.label}</BreadcrumbPage>
              )}
              {index < breadcrumbs.length - 1 && (
                <span className="mx-2">/</span>
              )}
            </BreadcrumbItem>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
};

export default BreadcrumbBlock;
