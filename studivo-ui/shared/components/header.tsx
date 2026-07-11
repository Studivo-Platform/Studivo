import { HeaderProps } from "../types/headerprops";

function Header(props: HeaderProps) {
    return (
        <header className="bg-white dark:bg-[#003161] p-5 md:p-6 rounded-3xl border border-[#95CCDD]/40 dark:border-[#006A67]/60 shadow-sm transition-all">
            <h1 className="text-xl md:text-2xl font-black text-[#293681] dark:text-[#FFF4B7] tracking-tight">
                {props.title}
            </h1>
            {props.description && (
                <p className="text-xs md:text-sm font-semibold text-gray-500 dark:text-gray-300 mt-1">
                    {props.description}
                </p>
            )}
        </header>
    );
}

export default Header;