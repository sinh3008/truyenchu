import StoryForm from "@/components/admin/StoryForm";

export default function NewStoryPage() {
  return (
    <div className="space-y-5 max-w-4xl">
      <div>
        <h2 className="font-heading text-lg font-bold text-text-heading">Thêm Truyện Mới</h2>
        <p className="text-xs text-text-muted mt-0.5">Điền thông tin để tạo truyện mới trong hệ thống</p>
      </div>
      <StoryForm mode="create" />
    </div>
  );
}
