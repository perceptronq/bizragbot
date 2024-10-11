export const Button = (props: React.PropsWithChildren) => {
    return (
        <button className="relative py-2 px-3 rounded-lg font-semibold text-sm bg-sky-500 shadow-[0px_0px_12px_#60A5FA]">
            <div className="absolute inset-0">
                <div className="border border-white/20 absolute inset-0 rounded-lg [mask-image:linear-gradient(to_bottom,black,transparent)]"></div>
                <div className="border border-white/40 absolute inset-0 rounded-lg [mask-image:linear-gradient(to_top,black,transparent)]"></div>
                <div className="absolute rounded-lg inset-0 shadow-[0_0_10px_rgb(140,69,255,.7)_insert]"></div>
            </div>
            <span>{props.children}</span>
        </button>
    );
}