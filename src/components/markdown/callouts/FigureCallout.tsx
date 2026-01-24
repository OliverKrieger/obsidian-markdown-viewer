// src/components/markdown/callouts/FigureCallout.tsx
import React from "react";

export type FigureVariant = "plain" | "framed" | "card";

export type FigureCalloutProps = {
    title?: string;
    src?: string;
    alt?: string;
    caption?: string;

    align?: "left" | "center" | "right";
    width?: string; // e.g. "70%", "420px"
    className?: string;
    variant?: FigureVariant;

    // Optional: click-through
    href?: string;
};

function alignToStyle(align: FigureCalloutProps["align"]): React.CSSProperties {
    switch (align) {
        case "left":
            return { marginRight: "auto" };
        case "right":
            return { marginLeft: "auto" };
        case "center":
        default:
            return { marginLeft: "auto", marginRight: "auto" };
    }
}

export const FigureCallout: React.FC<FigureCalloutProps> = ({
    title,
    src,
    alt,
    caption,
    align = "center",
    width,
    className,
    variant = "plain",
    href,
}) => {
    console.log("Rendering FigureCallout with src:", src);
    console.log("FigureCallout props:", {
        title,
        alt,
        caption,
        align,
        width,
        className,
        variant,
        href,
    });
    if (!src) {
        return (
            <section className={`my-6 p-4 rounded border ${className ?? ""}`}>
                {title && <h3 className="font-bold mb-2">{title}</h3>}
                <p className="text-sm opacity-70">Figure is missing an image source.</p>
            </section>
        );
    }

    const frameClasses =
        variant === "plain"
            ? ""
            : variant === "framed"
                ? "p-3 rounded-xl border"
                : "p-4 rounded-2xl border shadow-sm bg-white/50";

    const imgEl = (
        <img
            src={src}
            alt={alt ?? title ?? ""}
            className="block w-full h-auto rounded-lg"
            style={{ width: "100%" }}
        />
    );

    const wrappedImg = href ? (
        <a href={href} target="_blank" rel="noreferrer">
            {imgEl}
        </a>
    ) : (
        imgEl
    );

    return (
        <figure
            className={`my-6 ${className ?? ""}`}
            style={{
                ...(width ? { width } : null),
                ...alignToStyle(align),
            }}
        >
            {title && <figcaption className="font-bold mb-2">{title}</figcaption>}

            <div className={frameClasses}>{wrappedImg}</div>

            {caption && (
                <figcaption className="mt-2 text-sm italic text-center opacity-80">
                    {caption}
                </figcaption>
            )}
        </figure>
    );
};
