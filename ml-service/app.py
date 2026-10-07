from flask import Flask, request, jsonify
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.neighbors import NearestNeighbors
from sklearn.cluster import KMeans

app = Flask(__name__)

PROFICIENCY_MAP = {
    'BEGINNER': 1.0,
    'INTERMEDIATE': 2.0,
    'ADVANCED': 3.0,
    'EXPERT': 4.0
}

def build_vocabulary(target, candidates):
    """Collects unique skill names to construct feature vectors."""
    vocab = set()
    all_students = [target] + candidates
    for s in all_students:
        for sk in s.get('teachingSkills', []):
            vocab.add('teach:' + sk.get('skillName', '').strip().lower())
        for sk in s.get('learningSkills', []):
            vocab.add('learn:' + sk.get('skillName', '').strip().lower())
    return sorted(list(vocab))

def encode_student_vector(student, vocab):
    """Encodes a student profile into a multi-hot weighted feature vector."""
    vec = np.zeros(len(vocab), dtype=np.float32)
    vocab_map = {term: idx for idx, term in enumerate(vocab)}

    for sk in student.get('teachingSkills', []):
        key = 'teach:' + sk.get('skillName', '').strip().lower()
        if key in vocab_map:
            weight = PROFICIENCY_MAP.get(sk.get('proficiencyLevel', 'INTERMEDIATE'), 2.0)
            vec[vocab_map[key]] = weight

    for sk in student.get('learningSkills', []):
        key = 'learn:' + sk.get('skillName', '').strip().lower()
        if key in vocab_map:
            weight = PROFICIENCY_MAP.get(sk.get('proficiencyLevel', 'INTERMEDIATE'), 2.0)
            vec[vocab_map[key]] = weight

    return vec

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "healthy", "service": "PeerNova Python ML Recommendation Engine", "version": "1.0.0"})

@app.route('/recommend', methods=['POST'])
def recommend():
    try:
        data = request.get_json(force=True)
        target = data.get('targetStudent')
        candidates = data.get('candidateStudents', [])

        if not target or not candidates:
            return jsonify({"status": "success", "recommendations": []})

        vocab = build_vocabulary(target, candidates)
        if not vocab:
            return jsonify({"status": "success", "recommendations": []})

        # Encode feature vectors
        target_vec = encode_student_vector(target, vocab).reshape(1, -1)
        candidate_matrix = np.array([encode_student_vector(c, vocab) for c in candidates])

        # 1. Cosine Similarity Calculation
        cos_sims = cosine_similarity(target_vec, candidate_matrix)[0]

        # 2. KNN (K-Nearest Neighbors) Model
        n_neighbors = min(len(candidates), 5)
        knn_model = NearestNeighbors(n_neighbors=n_neighbors, metric='cosine')
        knn_model.fit(candidate_matrix)
        distances, indices = knn_model.kneighbors(target_vec)

        knn_dist_map = {}
        for dist, idx in zip(distances[0], indices[0]):
            knn_dist_map[idx] = float(dist)

        # 3. K-Means Clustering (Group students into learning clusters)
        n_clusters = min(len(candidates) + 1, 3)
        all_vecs = np.vstack([target_vec, candidate_matrix])
        kmeans = KMeans(n_clusters=n_clusters, random_state=42, n_init='auto')
        kmeans.fit(all_vecs)
        cluster_labels = kmeans.labels_
        target_cluster = cluster_labels[0]
        candidate_clusters = cluster_labels[1:]

        # Build recommendation scores
        results = []
        for idx, candidate in enumerate(candidates):
            sim_score = float(cos_sims[idx])
            knn_dist = knn_dist_map.get(idx, 1.0)
            cluster_id = int(candidate_clusters[idx])
            same_cluster = (cluster_id == target_cluster)

            # Calculate composite ML Compatibility Score (0 - 100%)
            base_score = sim_score * 70.0
            knn_boost = (1.0 - min(knn_dist, 1.0)) * 20.0
            cluster_boost = 10.0 if same_cluster else 5.0
            total_ml_score = round(min(99.0, max(60.0, base_score + knn_boost + cluster_boost)), 1)

            breakdown = f"Cosine Sim: {sim_score:.3f} | KNN Dist: {knn_dist:.3f} | Cluster #{cluster_id}"
            
            explanation = (
                f"Matched via Cosine Similarity ({sim_score * 100:.1f}%) and KNN Proximity in Learning Cluster #{cluster_id}."
                if same_cluster else
                f"Matched via Cosine Similarity vector distance with KNN feature score of {total_ml_score}%."
            )

            results.append({
                "profileId": candidate.get('profileId'),
                "studentId": candidate.get('studentId'),
                "fullName": candidate.get('fullName'),
                "email": candidate.get('email'),
                "college": candidate.get('college'),
                "department": candidate.get('department'),
                "yearOfStudy": candidate.get('yearOfStudy'),
                "bio": candidate.get('bio'),
                "verificationStatus": candidate.get('verificationStatus'),
                "mlScore": total_ml_score,
                "cosineSimilarity": round(sim_score, 3),
                "knnDistance": round(knn_dist, 3),
                "clusterId": cluster_id,
                "algorithmBreakdown": breakdown,
                "mlExplanation": explanation,
                "teachingSkills": candidate.get('teachingSkills', []),
                "learningSkills": candidate.get('learningSkills', [])
            })

        # Sort recommendations by highest ML score
        results.sort(key=lambda x: x['mlScore'], reverse=True)

        return jsonify({
            "status": "success",
            "algorithm": "Cosine Similarity + KNN + KMeans",
            "recommendations": results
        })

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

if __name__ == '__main__':
    print("Starting PeerNova Python ML Service on http://localhost:5000...")
    app.run(host='0.0.0.0', port=5000, debug=True)
