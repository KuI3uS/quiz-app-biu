import { Link, useParams, useNavigate } from "react-router-dom";
import { photos } from "../data/photos";
import StarRating from "./StarRating";

export default function PhotoDetails() {
    const { id } = useParams();
    const photoId = parseInt(id);
    const photo = photos.find((p) => p.id === photoId);
    const navigate = useNavigate();

    if (!photo) return <h2>Zdjęcie nie istnieje</h2>;

    const index = photos.findIndex((p) => p.id === photoId);

    const handleRate = (value) => {
        photo.rating =
            (photo.rating * photo.ratingsCount + value) / (photo.ratingsCount + 1);
        photo.ratingsCount += 1;
    };

    return (
        <div>
            <img src={photo.link} alt={photo.description} width="600" />
            <p>Autor: {photo.author}</p>
            <p>Data dodania: {photo.date}</p>
            <p>{photo.description}</p>
            <StarRating onRate={handleRate} />
            <p>Średnia ocena: {photo.rating.toFixed(2)}</p>

            <div style={{ marginTop: "10px" }}>
                {index > 0 && (
                    <button onClick={() => navigate(`/photo/${photos[index - 1].id}`)}>
                        &lt;
                    </button>
                )}
                {index < photos.length - 1 && (
                    <button onClick={() => navigate(`/photo/${photos[index + 1].id}`)}>
                        &gt;
                    </button>
                )}
            </div>
        </div>
    );
}