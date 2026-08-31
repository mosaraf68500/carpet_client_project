// Widths verified from the live site's compiled CSS:
// - "boxed" sections (Elementor kit content width):        1140px
// - "large" sections  (.elementor-section-large, theme):    1510px
// - "broad" sections  (.elementor-section-broad, theme):    1440px
// - header/footer bar (.container-extended, theme):         1380px
// - "wide" (theme's plain .container, used by WooCommerce
//    templates like /shop/ instead of Elementor's kit width): 1270px
const WIDTHS = {
  boxed: "max-w-[1140px]",
  large: "max-w-[1510px]",
  broad: "max-w-[1440px]",
  header: "max-w-[1380px]",
  wide: "max-w-[1270px]",
};

export default function Container({ as: Tag = "div", size = "boxed", className = "", children }) {
  return (
    <Tag className={`mx-auto w-full px-4 sm:px-8 ${WIDTHS[size] || WIDTHS.boxed} ${className}`}>
      {children}
    </Tag>
  );
}
