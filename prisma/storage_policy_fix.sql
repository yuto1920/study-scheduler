-- 既存のポリシーを一旦削除します
drop policy if exists "Allow authenticated users to upload files" on storage.objects;
drop policy if exists "Allow users to read their own files" on storage.objects;

-- シンプルなポリシー（ログインユーザーなら lecture-materials にアップロード可能）
create policy "Allow authenticated uploads"
on storage.objects for insert
to authenticated
with check ( bucket_id = 'lecture-materials' );

-- シンプルなポリシー（ログインユーザーなら lecture-materials を読み取り可能）
create policy "Allow authenticated reads"
on storage.objects for select
to authenticated
using ( bucket_id = 'lecture-materials' );
