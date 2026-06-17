import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import { useSkills, useAddSkill, useRemoveSkill } from '../hooks/useSkills'
import { Button } from '../../../components/ui/button'
import { Badge } from '../../../components/ui/badge'
import { Input } from '../../../components/ui/input'
import { Label } from '../../../components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/ui/select'
import { LoadingSpinner } from '../../../components/common/LoadingSpinner'
import { SKILL_LEVELS } from '../../../lib/constants'

interface SkillsManagerProps {
  userId: string
  isOwnProfile: boolean
}

export function SkillsManager({ userId, isOwnProfile }: SkillsManagerProps) {
  const { data: skills, isLoading } = useSkills(userId)
  const addSkill = useAddSkill()
  const removeSkill = useRemoveSkill()
  const [newSkill, setNewSkill] = useState('')
  const [newLevel, setNewLevel] = useState('Intermediate')
  const [isAdding, setIsAdding] = useState(false)

  const handleAddSkill = () => {
    if (!newSkill.trim()) return
    addSkill.mutate(
      { skill: newSkill.trim(), level: newLevel },
      {
        onSuccess: () => {
          setNewSkill('')
          setNewLevel('Intermediate')
          setIsAdding(false)
        },
      }
    )
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner />
      </div>
    )
  }

  const skillList = skills || []

  return (
    <div className="space-y-4">
      {skillList.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {skillList.map((skill) => (
            <Badge key={skill.id} variant="secondary" className="gap-1 px-3 py-1">
              <span className="font-medium">{skill.skill}</span>
              <span className="text-muted-foreground">({skill.level})</span>
              {isOwnProfile && (
                <button
                  onClick={() => removeSkill.mutate(skill.id)}
                  className="ml-1 hover:text-destructive"
                  disabled={removeSkill.isPending}
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </Badge>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">No skills added yet</p>
      )}

      {isOwnProfile && (
        <div className="mt-4">
          {isAdding ? (
            <div className="flex items-end gap-3">
              <div className="flex-1 space-y-1">
                <Label htmlFor="skill-input" className="text-xs">
                  Technology
                </Label>
                <Input
                  id="skill-input"
                  placeholder="e.g., React"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  className="h-9"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="level-select" className="text-xs">
                  Level
                </Label>
                <Select value={newLevel} onValueChange={setNewLevel}>
                  <SelectTrigger className="h-9 w-[130px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SKILL_LEVELS.map((level) => (
                      <SelectItem key={level} value={level}>
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2 pb-0.5">
                <Button
                  size="sm"
                  onClick={handleAddSkill}
                  disabled={!newSkill.trim() || addSkill.isPending}
                >
                  {addSkill.isPending ? 'Adding...' : 'Add'}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsAdding(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAdding(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Skill
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
