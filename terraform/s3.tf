resource "aws_s3_bucket" "seamless-lms-bucket" {
  bucket = "seamless-lms-bucket"
  tags = {
    Name = "seamless-lms-bucket"
  }
}

resource "aws_iam_user" "seamless-lms-bucket-user" {
  name = "seamless-lms-bucket-user"
  tags = {
    Name = "seamless-lms-bucket-user"
  }
}

resource "aws_iam_group" "seamless-lms-bucket-user-group" {
  name = "seamless-lms-bucket-user-group"
}

resource "aws_iam_user_group_membership" "seamless-lms-user-group-membership" {
  user = aws_iam_user.seamless-lms-bucket-user.name
  groups = [
    aws_iam_group.seamless-lms-bucket-user-group.name,
  ]
}

data "aws_iam_policy_document" "bucket-user" {
  statement {
    actions = [
      "s3:PutObject",
      "s3:GetObject",
      "s3:ListBucket",
      "s3:DeleteObject",
      "s3:PutObjectAcl"
    ]
    resources = [
      aws_s3_bucket.seamless-lms-bucket.arn,
      "${aws_s3_bucket.seamless-lms-bucket.arn}/*",
    ]
  }
}

resource "aws_iam_policy" "seamless-lms-bucket-user-policy" {
  name        = "seamless-lms-bucket-user-policy"
  description = "Policy for bucket user"
  policy      = data.aws_iam_policy_document.bucket-user.json
}

resource "aws_iam_group_policy_attachment" "seamless-lms-bucket-user-attach" {
  group      = aws_iam_group.seamless-lms-bucket-user-group.name
  policy_arn = aws_iam_policy.seamless-lms-bucket-user-policy.arn
}

resource "aws_s3_bucket_ownership_controls" "seamless-lms-bucket-ownership" {
  bucket = aws_s3_bucket.seamless-lms-bucket.id
  rule {
    object_ownership = "ObjectWriter"
  }
}


resource "aws_s3_bucket_acl" "seamless-lms-bucket-acl" {
  depends_on = [aws_s3_bucket_ownership_controls.seamless-lms-bucket-ownership]
  bucket     = aws_s3_bucket.seamless-lms-bucket.id
  acl        = "private"
}

data "aws_iam_policy_document" "allow_access_from_terraform_test_user" {
  statement {
    principals {
      type        = "AWS"
      identifiers = [aws_iam_user.seamless-lms-bucket-user.arn]
    }
    actions = [
      "s3:PutObject",
      "s3:GetObject",
      "s3:ListBucket",
      "s3:DeleteObject",
      "s3:PutObjectAcl"
    ]
    resources = [
      aws_s3_bucket.seamless-lms-bucket.arn,
      "${aws_s3_bucket.seamless-lms-bucket.arn}/*",
    ]
  }
}

resource "aws_s3_bucket_policy" "allow_access_from_terraform_test_user" {
  bucket = aws_s3_bucket.seamless-lms-bucket.id
  policy = data.aws_iam_policy_document.allow_access_from_terraform_test_user.json
}

resource "aws_s3_bucket_public_access_block" "seamless-lms-bucket-public-access" {
  bucket                  = aws_s3_bucket.seamless-lms-bucket.id
  block_public_acls       = false
  ignore_public_acls      = false
  block_public_policy     = true
  restrict_public_buckets = true
}
