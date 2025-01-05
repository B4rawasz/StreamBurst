interface LogoProps {
	className?: string;
}

const Logo = ({ className }: LogoProps) => {
	return (
		<svg
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className={className}
		>
			<path
				d="M22 13V9C22 7.89543 21.1046 7 20 7H4C2.89543 7 2 7.89543 2 9V20C2 21.1046 2.89543 22 4 22H10"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M17 2L12 7L7 2"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path d="M14 17.5H16" strokeLinecap="round" strokeLinejoin="round" />
			<path d="M15 16.5V18.5" strokeLinecap="round" strokeLinejoin="round" />
			<path d="M18.5 18H18.505" strokeLinecap="round" strokeLinejoin="round" />
			<path d="M20 17H20.005" strokeLinecap="round" strokeLinejoin="round" />
			<path
				d="M19.66 14.5H14.34C13.8451 14.5001 13.3679 14.6837 13.0005 15.0152C12.6331 15.3468 12.4017 15.8027 12.351 16.295C12.348 16.321 12.346 16.3455 12.3425 16.371C12.302 16.708 12 19.228 12 20C12 20.3978 12.158 20.7794 12.4393 21.0607C12.7206 21.342 13.1022 21.5 13.5 21.5C14 21.5 14.25 21.25 14.5 21L15.207 20.293C15.3945 20.1055 15.6488 20.0001 15.914 20H18.086C18.3512 20.0001 18.6055 20.1055 18.793 20.293L19.5 21C19.75 21.25 20 21.5 20.5 21.5C20.8978 21.5 21.2794 21.342 21.5607 21.0607C21.842 20.7794 22 20.3978 22 20C22 19.2275 21.698 16.708 21.6575 16.371C21.654 16.346 21.652 16.321 21.649 16.2955C21.5984 15.8032 21.367 15.3471 20.9996 15.0154C20.6322 14.6838 20.1549 14.5001 19.66 14.5Z"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
};

export default Logo;
