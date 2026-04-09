export default function Logo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
    const boxSize = size === "sm" ? "h-6" : size === "lg" ? "h-12" : "h-10";

    return (
        <div className="flex items-center">
            <img
                src="/logoImages/logo.png"
                alt="Logo"
                className={`${boxSize} object-contain`}
            />
        </div>
    );
}
