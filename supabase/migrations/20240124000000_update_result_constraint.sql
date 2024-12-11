-- resultカラムの制約を更新
ALTER TABLE study_records DROP CONSTRAINT study_records_result_check;
ALTER TABLE study_records ADD CONSTRAINT study_records_result_check CHECK (result BETWEEN 1 AND 4); 