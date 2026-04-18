function CategoryCard({ category, onClick }) {
  return (
    <div
      className="category-card text-center p-3"
      onClick={() => onClick(category.name)}
      style={{ cursor: "pointer" }}
    >
      <div className="category-icon mb-2">{category.icon}</div>
      <div className="fw-semibold">{category.name}</div>
    </div>
  );
}

export default CategoryCard;