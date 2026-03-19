interface Prop {
  color?: string;
}

function TabIcon({ color = "#fff" }: Prop) {
  return (
    <>
      <svg
        width={378.13}
        height={50}
        viewBox="0 0 507 67"
        fill={color}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M124.819 19.1691C129.575 9.19994 138.931 0 149.977 0H345.32C356.366 0 365.794 9.22375 370.832 19.0539C380.982 38.8602 409.822 67 491.773 67C618.225 67 -104.196 67 12.8905 67C88.6239 67 115.372 38.9692 124.819 19.1691Z"
          fill={color}
        />
      </svg>
    </>
  );
}

export default TabIcon;
