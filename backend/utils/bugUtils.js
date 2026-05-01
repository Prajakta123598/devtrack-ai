const suggestPriority = (title, description, severity) => {
  const text = `${title} ${description}`.toLowerCase();

  if (
    severity === "High" &&
    (
      text.includes("crash") ||
      text.includes("payment") ||
      text.includes("security") ||
      text.includes("login failed") ||
      text.includes("data loss")
    )
  ) {
    return "Critical";
  }

  if (severity === "High") {
    return "High";
  }

  if (severity === "Medium") {
    return "Medium";
  }

  return "Low";
};

const isDuplicateBug = (newTitle, existingBugs) => {
  const formattedNewTitle = newTitle.trim().toLowerCase();

  for (let bug of existingBugs) {
    const formattedOldTitle = bug.title.trim().toLowerCase();

    if (formattedOldTitle === formattedNewTitle) {
      return true;
    }
  }

  return false;
};

module.exports = {
  suggestPriority,
  isDuplicateBug,
};