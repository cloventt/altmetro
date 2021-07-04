ng build --base-href '/altmetro/'
COMMIT=$(git rev-parse --short HEAD)
docker build -t altmetro:$COMMIT .
docker save altmetro:$COMMIT -o ~/altmetro-$COMMIT.tar.gz
