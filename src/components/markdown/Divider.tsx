export function Divider() {
    return (
        <div className="fancy-divider">
            <div
                className="grow border-t"
                style={{ borderColor: "var(--color-border-subtle)" }}
            />
            <span
                className="mx-4 text-xl"
                style={{ color: "color-mix(in sRGB, var(--color-tertiary-500) 60%, transparent)" }}
            >
                ◆
            </span>
            <div
                className="grow border-t"
                style={{ borderColor: "var(--color-border-subtle)" }}
            />
        </div>
    );
}
