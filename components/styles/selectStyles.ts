import { StyleSheet } from "react-native";

export const selectStyles = StyleSheet.create({
  container: {
    marginBottom: 10,
  },
  textInput: {
    backgroundColor: "#fff",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 8,
    maxWidth: 300,
    width: "90%",
    maxHeight: "60%",
    elevation: 8,
  },
  optionsList: {
    maxHeight: 500,
  },
  optionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  selectedOptionItem: {
    backgroundColor: "#E3F2FD",
  },
  optionText: {
    fontSize: 16,
    color: "#333",
    flex: 1,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  selectedOptionText: {
    color: "#1976D2",
    fontWeight: "600",
  },
  checkmark: {
    fontSize: 16,
    color: "#1976D2",
    fontWeight: "bold",
  },
  // MultiLevelSelect 专用样式
  breadcrumbContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#F5F5F5",
  },
  breadcrumb: {
    flexDirection: "row",
    alignItems: "center",
  },
  breadcrumbItem: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: "#E3F2FD",
    borderRadius: 4,
    marginRight: 4,
  },
  breadcrumbText: {
    fontSize: 12,
    color: "#1976D2",
  },
  breadcrumbSeparator: {
    marginHorizontal: 4,
    color: "#666",
    fontSize: 12,
  },
  actionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  actionButton: {
    minWidth: 80,
  },
});
